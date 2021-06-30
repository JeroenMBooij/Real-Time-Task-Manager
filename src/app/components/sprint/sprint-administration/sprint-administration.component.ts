import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ISprint } from 'src/app/models/sprint';
import { SprintService } from 'src/app/services/sprint/sprint.service';
import { UserstoryDataSource } from '../../backlog/backlog.datasource';
import { UserstoryService } from 'src/app/services/userstory/userstory.service';
import * as UserstoryConstant from 'src/app/models/constants/userstory.constants';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { IUserstory } from 'src/app/models/userstory';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as AngularConstants from 'src/app/models/constants/angular-constants';
import { Observable } from 'rxjs/internal/Observable';


@Component({
  selector: 'sprint-administration',
  templateUrl: './sprint-administration.component.html',
  styleUrls: ['./sprint-administration.component.scss']
})
export class SprintAdministrationComponent implements OnInit {

    public projectId: string;
    public sprintId: string;
    public sprint: Observable<ISprint>;
    public sprintName: string;
    public isCurrentSprint: boolean;
    public display: boolean;
    public backlogDataSource: UserstoryDataSource;
    public sprintDataSource: UserstoryDataSource;
    public displayedColumns: string[] = ['assignee','name'];

    public activeSprintErrorMessage: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute, 
        private location: Location,
        private sprintService: SprintService,
        private userstoryService: UserstoryService,
        private dialog: MatDialog) 
    {}

    async ngOnInit(): Promise<void> 
    {
        this.route.params.subscribe(params => {
            this.sprintId = params["sprintId"];
            this.projectId = params["projectId"];
        });

        try
        {
            this.sprint = this.sprintService.getSprintById(this.projectId, this.sprintId);
            this.sprint.subscribe(sprint => {
                this.isCurrentSprint = sprint.isCurrentSprint ?? false
                this.sprintName = sprint.name;
            
                let backlogUserstories = this.userstoryService.getProjectUserstoriesByLocation(this.projectId, UserstoryConstant.backlog);
                this.backlogDataSource = new UserstoryDataSource(backlogUserstories);

                let sprintUserstories = this.userstoryService.getProjectUserstoriesByLocation(this.projectId, sprint.name);
                this.sprintDataSource = new UserstoryDataSource(sprintUserstories);
            });
            
        }
        catch(error)
        {
            //Redirect because URL is invalid
            this.location.back();
        }
    }

    public async handleCurrentSprint(activate: boolean): Promise<void>
    {
        let message: string;
        if(activate)
            message = `Are you sure you want to open this sprint? 
            <br> It will add all the userstories of this sprint to the scrumboard`;
        else
            message = `Are you sure you want to close this sprint? 
            <br> It will remove all userstories from the scrumboard and reset your burndown chart`;

        let dialogReference = this.dialog.open(ConfirmationDialogComponent, {
            width: "600px",
            data: message
        });

        dialogReference.afterClosed().subscribe(async result => {
            if(result == AngularConstants.confirm)
            {

                this.sprint.subscribe(async sprint => {
                    this.activeSprintErrorMessage = await this.sprintService.handleCurrentSprint(this.projectId, sprint, activate);
                           
                    if(this.activeSprintErrorMessage == null && activate)
                        this.isCurrentSprint = activate;
                    else
                    // (else) this.isCurrentSprint to update the binding
                        this.isCurrentSprint = false;
                })
            }
            else
            {
                // this is done for Angular binding to update, because Angular is not smart enough to watch the current state of the model
                this.isCurrentSprint = false;
                this.isCurrentSprint = !activate;
            }
        });
        
        
    }

    public drop(location: string, event: CdkDragDrop<IUserstory[]>): void
    {
        if (event.previousContainer === event.container) 
            return;
        
        const userstory = event.previousContainer.data[event.previousIndex];
        userstory.location = location;

        this.userstoryService.updateUserstory(this.projectId, userstory.id, userstory);
    }


    public navigateToAllSprintDetails(): void
    {
        this.router.navigate([`project/${this.projectId}/sprint/${this.sprintId}/details`]);
    }

    public navigateToAllSprints(): void
    {
        this.router.navigate([`project/${this.projectId}/sprints`]);
    }

}
