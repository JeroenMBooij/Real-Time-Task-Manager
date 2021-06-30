import { DataSource } from "@angular/cdk/collections";
import { forkJoin, Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { Member } from "src/app/models/Member";
import { Project } from "src/app/models/project/project";
import { User } from "src/app/models/user";
import { ProjectService } from "src/app/services/project/project.service";
import { UserService } from "src/app/services/user/user.service";


export class MembersDataSource extends DataSource<any> {
    constructor(
        private projectId: string,
        private userService: UserService,
        private projectService: ProjectService
        ) {
      super();
    }
    connect(): Observable<Member[]> { //TODO: dis
        return this.projectService.getMembersByProject(this.projectId);
    }
    
    disconnect() {
        
    }
  }