import { Location } from '@angular/common';
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
  selector: 'app-update-project-member',
  templateUrl: './update-project-member.component.html',
  styleUrls: ['./update-project-member.component.scss']
})
export class UpdateProjectMemberComponent implements OnInit {

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
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    ) { }

  async ngOnInit(): Promise<void> {
    this.member = new Member();
    
    let projectId = this.route.snapshot.paramMap.get('projectId')
    this.project = history.state?.prefillProject !== undefined 
    ? history.state?.prefillProject 
    : await this.projectService.getProjectOnce(projectId);
    this.member = history.state?.member !== undefined 
    ? history.state?.member
    : this.router.navigate(['/project/'+projectId+'/members']);
    
    this.role.setValue(this.member.role);
  }

  async updateMember() {
    this.changeRole(this.role.value);
    if(this.isValid()) {
      this.projectService.UpdateProjectMember(this.member, this.project.id, this.member.id);
      this.router.navigate(['/project/'+this.project.id+'/members']);
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
