import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Member } from 'src/app/models/Member';
import { Project } from 'src/app/models/project/project';
import { roles } from 'src/app/models/roles';
import { ProjectService } from 'src/app/services/project/project.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-add-project-member',
  templateUrl: './add-project-member.component.html',
  styleUrls: ['./add-project-member.component.scss']
})
export class AddProjectMemberComponent implements OnInit {

  public member : Member;
  public roles : Array<string> = ['admin', 'member'];
  public project: Project;
  public errors: string;

  memberForm = new FormGroup({
    name     : new FormControl('',[
      Validators.required,
    ]),
    role: new FormControl(roles.admin, [
      Validators.required,
    ])
  });

  get name() { return this.memberForm.get('name') }

  get role() { return this.memberForm.get('role') }

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    this.member = new Member();
    
    this.role.setValue(roles.admin);

    let projectId: string;
    this.route.params.subscribe(params => {
        projectId = params["projectId"];
    });
    
    this.project = history.state?.prefillProject !== undefined 
      ? history.state?.prefillProject 
      : await this.projectService.getProject(projectId).pipe(first()).toPromise();
  }

  async addMember() {
    this.changeRole(this.role.value);
    if(this.isValid()) {
      let possibleUsers = await this.userService.getUsersWithUsername(this.member.username);
      if(possibleUsers === undefined || possibleUsers.length <= 0) {
        this.errors = "member doesn't exist";
        return
      }
      else {
        
        let members: Member[] = await this.projectService.getProjectMembersByProjectPromise(this.project.id);
        if(members.filter(result => result.uid === possibleUsers[0].uid).length <= 0) {
          let newMember = new Member();
          newMember.uid = possibleUsers[0].uid;
          newMember.username = possibleUsers[0].username;
          newMember.role = this.member.role;

          this.projectService.addProjectMember(newMember, this.project.id);
          this.router.navigate([`/project/${this.project.id}/members`]);
        }
        else {
          this.errors = 'member already added to project';
          return
        }
        
      }
    }
  }

  changeRole(role: any) {
    let newRole: roles;
    switch (role) {
      case 'owner':
        newRole = roles.owner;
        break;
      case 'admin':
        newRole = roles.admin;
        break;
      case 'member':
        newRole = roles.member;
        break;
      default:
        return;
    }
    this.member.role = newRole;
  }

  close() {
    this.router.navigate([`/project/${this.project.id}/members`]);
  }

  isValid() : boolean {
    return this.member.username !== undefined
      && this.member.role !== undefined
  }
}
