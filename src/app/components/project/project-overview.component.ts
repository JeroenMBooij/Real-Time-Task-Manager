import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project/project';
import { ProjectService } from 'src/app/services/project/project.service';
import { UserService } from 'src/app/services/user/user.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { ProjectDataSource } from './ProjectDataSource';
import * as AngularConstants from 'src/app/models/constants/angular-constants';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {

  public projects: ProjectDataSource;
  public displayedColumns = ['owner', 'name', 'description', 'status', 'addproj'];
  public selected: any;
  public showArchived: boolean = false;

  projectForm = new FormGroup({
    archivedCheckbox : new FormControl('',[
      Validators.required,
    ]),
  });

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    this.userService.getCurrentUserDoc().then(users => {
        let user = users[0];
        this.projects = new ProjectDataSource(this.projectService, user, this.showArchived);
      });
    
  }

  addProject() {
    this.router.navigate(['/addproject']);
  }

  updateProject(project : Project) {
    this.router.navigate(['/updateproject'], { state: { prefillProject: project } });
  }

  deleteProject(project : Project) {
    let dialogReference = this.dialog.open(ConfirmationDialogComponent, {
      width: "600px",
      data: `Are you sure you want to archive this project? 
      <br> It'll be permanently deleted.`
    });

    dialogReference.afterClosed().subscribe(async result => {
      if(result == AngularConstants.confirm)
      {
        this.projectService.deleteProject(project.id);
      }
    });
  }

  navToProject(project : Project) {
    if(!project.isArchived) {
      this.router.navigate([`/project/${project.id}/backlog`], { state: { prefillProject: project } });
    }
    else {
      this.router.navigate([`/project/${project.id}/update`], { state: { prefillProject: project } });
    }

  }

  setShowArchived(newArchived: boolean) {
    this.showArchived = newArchived;
    this.userService.getCurrentUserDoc().then(users => {
      let user = users[0];
      this.projects = new ProjectDataSource(this.projectService, user, this.showArchived);
    });
  }
}
