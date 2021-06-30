import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from 'src/app/models/Member';
import { Project } from 'src/app/models/project/project';
import { ProjectService } from 'src/app/services/project/project.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})
export class UpdateProjectComponent implements OnInit {

  public project: Project;

  projectForm = new FormGroup({
    name     : new FormControl('',[
      Validators.required,
    ]),
    description: new FormControl('',[
      Validators.required
    ]),
    archived: new FormControl('',[
      Validators.required
    ]),
  });

  get name() { return this.projectForm.get('name') }

  get description() { return this.projectForm.get('description') }

  get archived() { return this.projectForm.get('archived') }

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute

  ) {
    this.project = new Project();
   }

  async ngOnInit(): Promise<void> {
    let projectId: string;
    this.route.params.subscribe(params => {
        projectId = params["projectId"];
    });
    this.project = await this.projectService.getProjectOnce(projectId);
  }

  async initNewProject() : Promise<Project> {
    let project = new Project();
    return project;
  }

  updateProject() {
    if(this.isValid()) {
      this.projectService.updateProject(this.project);
      this.router.navigate(['/project/'+this.project.id+'/backlog']);
    }
  }

  close() {
    this.router.navigate(['/project/'+this.project.id+'/backlog']);
  }

  isValid() : boolean {
    return this.project.name !== undefined
      && this.project.description !== undefined
      && this.project.isArchived !== undefined
      && this.project.owner !== undefined
      && this.project.projectMembers !== undefined
    
  }
}
