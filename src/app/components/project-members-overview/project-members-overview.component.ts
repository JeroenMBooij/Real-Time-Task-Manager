import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Member } from 'src/app/models/Member';
import { Project } from 'src/app/models/project/project';
import { roles } from 'src/app/models/roles';
import { User } from 'src/app/models/user';
import { ProjectService } from 'src/app/services/project/project.service';
import { UserService } from 'src/app/services/user/user.service';
import { MembersDataSource } from './MembersDataSource';
import * as AngularConstants from 'src/app/models/constants/angular-constants';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-project-members-overview',
  templateUrl: './project-members-overview.component.html',
  styleUrls: ['./project-members-overview.component.scss']
})
export class ProjectMembersOverviewComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'role', 'addUpdate'];
  public projectId: string;
  public project: Observable<Project>;
  public dataSource: MembersDataSource;

  constructor(
      private route: ActivatedRoute, 
      private router: Router,
      private projectService: ProjectService,
      private userService: UserService,
      private dialog: MatDialog)
    { 
        this.route.params.subscribe(params => {
            this.projectId = params["projectId"];
        });

    }

  async ngOnInit(): Promise<void> {
    this.project = this.projectService.getProject(this.projectId);
    let id = await (await this.projectService.getProject(this.projectId).pipe(first()).toPromise()).id;
    this.dataSource = new MembersDataSource(id, this.userService, this.projectService);
  }

  async addMember() {
    this.router.navigate([`project/${this.projectId}/members/add`], { state: { prefillProject: await this.project.pipe(first()).toPromise() } });
  }
  
  async updateMember(member: Member) {
    if(member.role !== roles.owner)
      this.router.navigate([`project/${this.projectId}/members/update`], { state: { prefillProject: await this.project.pipe(first()).toPromise(), member: member } });
  }

  removeMember(member: User) {
    let dialogReference = this.dialog.open(ConfirmationDialogComponent, {
      width: "600px",
      data: `Are you sure you want to remove this member? 
      <br> You can add members back at any time.`
    });

    dialogReference.afterClosed().subscribe(async result => {
      if(result == AngularConstants.confirm)
      {
        this.projectService.removeMember(this.projectId, member.id, member.uid);
      }
    });
  }
}
