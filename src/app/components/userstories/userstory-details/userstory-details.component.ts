import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { IUserstory } from 'src/app/models/userstory';
import { UserstoryService } from 'src/app/services/userstory/userstory.service';
import * as UserstoryConstant from 'src/app/models/constants/userstory.constants';
import { ProjectService } from 'src/app/services/project/project.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as AngularConstants from 'src/app/models/constants/angular-constants';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs/internal/Observable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';

@Component({
  selector: 'userstory-details',
  templateUrl: './userstory-details.component.html',
  styleUrls: ['./userstory-details.component.scss']
})
export class UserstoryDetailsComponent implements OnInit {

    public saveMessage: string = "Userstory is saved!";
    public projectId: string;
    public userstoryId: string;
    public userstory: Observable<IUserstory>;
    public isArchived: boolean;
    public assignees: Observable<string[]>;

    public userstoryForm = new FormGroup({
        name     : new FormControl('',[
          Validators.required,
          Validators.maxLength(50)
        ]),
        assignee: new FormControl(''),
        description: new FormControl('',[
          Validators.required,
          Validators.maxLength(500)
        ]),
        storypoints: new FormControl('',[
          Validators.required,
        ])
      });

    get name() { return this.userstoryForm.get('name') }

    get assignee() { return this.userstoryForm.get('assignee') }

    get description() { return this.userstoryForm.get('description') }

    get points() { return this.userstoryForm.get('storypoints') }

    constructor(
        private route: ActivatedRoute, 
        private location: Location,
        private userstoryService: UserstoryService,
        private projectService: ProjectService,
        private dialog: MatDialog,
        private snackbar: MatSnackBar) 
    { }

    async ngOnInit(): Promise<void> 
    {        
        this.route.params.subscribe(params => {
            this.projectId = params["projectId"];
            this.userstoryId = params["userstoryId"];
        });

        try
        {
            if(this.userstoryId === AngularConstants.create)
            {
                this.userstory = await this.userstoryService.createUserstory(this.projectId);
            }
            else
            {
                this.userstory = this.userstoryService.getUserstoryById(this.projectId, this.userstoryId);
            }

            this.assignees = this.projectService.getProjectMemberUsernames(this.projectId);

            this.userstory.subscribe(userstory => {

                this.isArchived = userstory.location == UserstoryConstant.archive;
                this.userstoryId = userstory.id;

                this.userstoryForm.patchValue(userstory);
            });

        }
        catch(error)
        {
            //Redirect because URL is invalid
            this.location.back();
        }
    }

    public saveUserstoryChanges(): void
    {
        if(this.userstoryForm.status == AngularConstants.valid)
        {
            let userstory = this.userstoryForm.value;

            this.userstoryService.updateUserstory(this.projectId, this.userstoryId, userstory);

            this.snackbar.openFromComponent(SnackBarComponent, {
                data: this.saveMessage,
                duration: 3000
            });
        }
    }

    public async delete(): Promise<void>
    {
        let dialogReference = this.dialog.open(ConfirmationDialogComponent, {
            width: "600px",
            data: `Are you sure you want to delete this userstory? 
            <br> It will be complete removed and you can never retrieve it again`
        });

        dialogReference.afterClosed().subscribe(async result => {
            if(result == AngularConstants.confirm)
            {
                await this.userstoryService.deleteUserstory(this.projectId, this.userstoryId);
                this.location.back();
            }
        });
    }

    public async handleArchive(isArchive: boolean): Promise<void>
    {
        let userstory: IUserstory = await new Promise((resolve, reject) => {
            this.userstory.subscribe(data => resolve(data))
        });

        let message: string;
        if(isArchive)
            message = `Are you sure you want to archive this userstory? 
            <br> It will be removed from the ${userstory.location}. However, it can be recovered by going to this project archive.`;
        else
            message = `Are you sure you want to recover this userstory? 
            <br> It will return to this project's ${userstory.location}.`;

        let dialogReference = this.dialog.open(ConfirmationDialogComponent, {
            width: "600px",
            data: message
        });

        dialogReference.afterClosed().subscribe(async result => {
            if(result == AngularConstants.confirm)
            {
                if(isArchive)
                    userstory.location = UserstoryConstant.archive;
                else
                    userstory.location = UserstoryConstant.backlog;
                
                this.isArchived = isArchive;
                this.userstoryService.updateUserstory(this.projectId, userstory.id, userstory);

                this.snackbar.openFromComponent(SnackBarComponent, {
                    data: this.saveMessage,
                    duration: 3000
                });
            }
            else
                // this is done for Angular binding to update, because Angular is not smart enough to use a two-way binding
                this.isArchived = !isArchive;
        });
        
        
    }

}
