import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { IUserstory } from 'src/app/models/userstory';
import { UserstoryService } from 'src/app/services/userstory/userstory.service';
import { UserstoryDataSource } from './backlog.datasource';
import * as UserstoryConstant from 'src/app/models/constants/userstory.constants';
import { Member } from 'src/app/models/Member';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})

export class BacklogComponent implements OnInit {

    public displayedColumns: string[] = ['name', 'description', 'assignee', 'status', 'points'];
    public projectId: string;
    public dataSource: UserstoryDataSource;
    members: Member[];

    constructor(
        private location: Location,
        private route: ActivatedRoute, 
        private router: Router,
        private userstoryService: UserstoryService,
        private projectService: ProjectService) 
    { 
        this.route.params.subscribe(params => {
            this.projectId = params["projectId"];
        });

        try
        {
            let userstories: Observable<IUserstory[]> = this.userstoryService.getProjectUserstoriesByLocation(this.projectId, UserstoryConstant.backlog);
            this.dataSource = new UserstoryDataSource(userstories);
            this.projectService.getProjectOnce(this.projectId).then(project => {
                if(project.isArchived) {
                    this.router.navigate([`/project/${project.id}/update`], { state: { prefillProject: project } });
                }
            });
        }
        catch(error)
        {
            location.back();
        }

    }

    async ngOnInit() {
        this.members = await this.projectService.getProjectMembersByProjectPromise(this.route.snapshot.paramMap.get('projectId'))
    }

    public navigateToCreateUserStory(): void
    {
        this.router.navigate([`project/${this.projectId}/userstory/new/details`]);
    }
    
    getAssigneeName(assigneeId: string) : string {
        return this.members.find(member => member.id === assigneeId).username;
    }
}


