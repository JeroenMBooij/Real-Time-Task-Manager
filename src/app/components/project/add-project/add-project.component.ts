import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Member } from 'src/app/models/Member';
import { Project } from 'src/app/models/project/project';
import { roles } from 'src/app/models/roles';
import { User } from 'src/app/models/user';
import { ProjectService } from 'src/app/services/project/project.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

  public project: Project;
  private owner : Member;

  projectForm = new FormGroup({
    name     : new FormControl('',[
      Validators.required,
    ]),
    description: new FormControl('',[
      Validators.required,
    ]),
    archived: new FormControl('',[
      Validators.required,
    ]),
  });

  get name() { return this.projectForm.get('name') }

  get description() { return this.projectForm.get('description') }

  get archived() { return this.projectForm.get('archived') }

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.project = new Project();
    this.project.name = undefined;
    this.project.description = '';
    this.project.isArchived = false;
    this.project.projectMembers = [];
    this.project.status = 'started';
    this.userService.getCurrentUserDoc().then(users => {
      let user = users[0];
      this.project.owner = user.uid;
      this.project.projectMembers.push(user.uid);

      this.owner = new Member();
      this.owner.uid = user.uid;
      this.owner.username = user.username;
      this.owner.role = roles.owner;
    }, err => console.error(err));
  }

  async addProject() {
    if(this.isValid()) {
      let projectRef = await this.projectService.createProject(this.project);
      this.projectService.addProjectMember(this.owner, projectRef.id);
      this.router.navigate(['']);
    }
  }

  close() {
    this.router.navigate(['']);
  }

  isValid() : boolean {
    return this.project.name !== undefined
      && this.project.description !== undefined
      && this.project.isArchived !== undefined
      && this.project.owner !== undefined
    
  }
}
