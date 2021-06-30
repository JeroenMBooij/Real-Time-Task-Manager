import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { IUserstory } from 'src/app/models/userstory';
import { UserstoryService } from 'src/app/services/userstory/userstory.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as UserstoryConstant from 'src/app/models/constants/userstory.constants'
import { ScrumBoard } from 'src/app/models/scrumboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../shared/snack-bar/snack-bar.component';

@Component({
  selector: 'scrumboard',
  templateUrl: './scrumboard.component.html',
  styleUrls: ['./scrumboard.component.scss']
})
export class ScrumBoardComponent implements OnInit {

    public projectId: string;
    public scrumboard: ScrumBoard;
    
    constructor(
        private route: ActivatedRoute, 
        private router: Router,
        private userstoryService: UserstoryService,
        private snackbar: MatSnackBar) 
    { }

    async ngOnInit(): Promise<void> {

        this.route.params.subscribe(params => {
            this.projectId = params["projectId"];
        });
        
        this.scrumboard = await this.userstoryService.getScrumboardData(this.projectId);

        if(this.scrumboard == null)
        {
            this.snackbar.openFromComponent(SnackBarComponent, {
                data: "There is no open sprint in this project",
                duration: 3000
            });

            this.router.navigate([`project/${this.projectId}/backlog`]);
        }

    }

    public move(username: string, status: string, event: CdkDragDrop<IUserstory[]>): void 
    {
        if (event.previousContainer === event.container) 
            return;

        const userstory = event.previousContainer.data[event.previousIndex];
        userstory.assignee = username;
        userstory.status = status;
        if(status === 'done') userstory.completedDate = new Date().toUTCString();
        else userstory.completedDate = null;
        this.userstoryService.updateUserstory(this.projectId, userstory.id, userstory);

        transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
        );
    }

    public drop(event: CdkDragDrop<IUserstory[]>): void
    {
        if (event.previousContainer === event.container) 
            return;

        const userstory = event.previousContainer.data[event.previousIndex];
        userstory.assignee = UserstoryConstant.unAssigned
        
        this.userstoryService.updateUserstory(this.projectId, userstory.id, userstory);

        transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
        );

    }


    public navigateToBacklog(): void
    {
        this.router.navigate([`project/${this.projectId}/backlog`]);
    }

    public openUserstory(userstory: IUserstory): void
    {
        this.router.navigate([`project/${this.projectId}/userstory/${userstory.id}/details`]);
    }
    

}

