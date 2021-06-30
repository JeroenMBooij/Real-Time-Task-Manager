import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISprint } from 'src/app/models/sprint';
import { DatePipe, Location } from '@angular/common'
import { SprintService } from 'src/app/services/sprint/sprint.service';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import * as AngularConstants from 'src/app/models/constants/angular-constants';
import { Observable } from 'rxjs/internal/Observable';
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'sprint-details',
  templateUrl: './sprint-details.component.html',
  styleUrls: ['./sprint-details.component.scss']
})
export class SprintDetailsComponent implements OnInit {

    public projectId: string;
    public sprintId: string;
    public sprint: Observable<ISprint>;
    public sprintConstraintMessage: string;
    public username: string;

    public sprintForm = new FormGroup({
        name     : new FormControl('',[
          Validators.required,
          Validators.maxLength(100)
        ]),
        description: new FormControl('',[
          Validators.required,
        ]),
        startDate: new FormControl('',[
          Validators.required,
        ]),
        endDate: new FormControl('',[
            Validators.required,
            this.dateRangeValidator()
          ]),
      });

    get name() { return this.sprintForm.get('name') }

    get description() { return this.sprintForm.get('description') }

    get startDate() { return this.sprintForm.get('startDate') }

    get endDate() { return this.sprintForm.get('endDate') }

    public saveMessage: string = "Sprint is saved!";

    constructor(
        private route: ActivatedRoute, 
        private router: Router,
        private location: Location,
        private sprintService: SprintService,
        private userService: UserService,
        private dialog: MatDialog,
        private datePipe: DatePipe,
        private snackbar: MatSnackBar) 
    {}

    async ngOnInit(): Promise<void> {

        this.route.params.subscribe(params => {
            this.sprintId = params["sprintId"];
            this.projectId = params["projectId"];
        });

        try
        {
            if(this.sprintId === AngularConstants.create)
            {
                this.username = (await this.userService.getCurrentUserDoc())[0].username;
                this.sprint = await this.sprintService.createSprint(this.projectId, this.username);
            }
            else
            {
                    this.sprint = this.sprintService.getSprintById(this.projectId, this.sprintId);
            }

            this.sprint.subscribe(sprint => {
                this.sprintId = sprint.id;
                this.username = sprint.owner;
                this.sprintForm.patchValue(sprint);
                let startDate = new Date(sprint.startDate);
                let endDate = new Date(sprint.endDate);
                this.sprintForm.get("startDate").setValue(this.datePipe.transform(startDate, 'yyyy-MM-dd'));
                this.sprintForm.get("endDate").setValue(this.datePipe.transform(endDate, 'yyyy-MM-dd'));
            })
        }
        catch(error)
        {
            //Redirect because URL is invalid
            this.location.back();
        }

        this.sprintForm.controls.startDate.valueChanges.subscribe(value => this.sprintForm.controls.endDate.updateValueAndValidity());
    }

    public async saveSprintChanges(): Promise<void>
    {
        if(this.sprintForm.status == AngularConstants.valid)
        {
            this.sprintConstraintMessage =  null;
            let sprint = this.sprintForm.value as ISprint;

            this.sprintConstraintMessage = await this.sprintService.updateSprint(this.projectId, this.sprintId, sprint);

            this.snackbar.openFromComponent(SnackBarComponent, {
                data: this.saveMessage,
                duration: 3000
            });
        }
    }

    public async delete(): Promise<void>
    {
        let sprint: ISprint = await new Promise((resolve, reject) => {
            this.sprint.subscribe(document => resolve(document));
        });

        let dialogReference = this.dialog.open(ConfirmationDialogComponent, {
            width: "600px",
            data: `Are you sure you want to delete sprint: ${sprint.name}? 
            <br> All userstories in this sprint will be added to the backlog`
        });

        dialogReference.afterClosed().subscribe(async result => {
            if(result == AngularConstants.confirm)
            {
                await this.sprintService.deleteSprint(this.projectId, this.sprintId, sprint.name);
                this.router.navigate([`/project/${this.projectId}/sprints`]);
            }
        });
    }

    public dateRangeValidator(): ValidatorFn
    {
        return (control: AbstractControl): {[key: string]: boolean} | null => {
            let endDate = control.root.get("endDate")?.value;
            let startDate = control.root.get("startDate")?.value;

            if(Date.parse(startDate) >= Date.parse(endDate))
                return {"invalidRange": true};
            
            return null;
        };
    }
}

