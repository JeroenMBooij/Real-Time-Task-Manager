import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { Project } from "src/app/models/project/project";
import { User } from "src/app/models/user";
import { ProjectService } from "src/app/services/project/project.service";


export class ProjectDataSource extends DataSource<any> {
    constructor(private projectService: ProjectService, private curUser: User, private isArchived: boolean) {
      super();
    }
    connect(): Observable<Project[]> {
      return this.projectService.getProjectsOfUser(this.curUser.uid, this.isArchived);
    }
    disconnect() {
    }
  }