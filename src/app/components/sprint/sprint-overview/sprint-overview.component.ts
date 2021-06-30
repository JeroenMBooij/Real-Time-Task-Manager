import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { ISprint } from 'src/app/models/sprint';
import { SprintService } from 'src/app/services/sprint/sprint.service';
import { SprintDataSource } from './sprint-overview.datasource';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-sprint-overview',
  templateUrl: './sprint-overview.component.html',
  styleUrls: ['./sprint-overview.component.scss']
})
export class SprintOverviewComponent implements OnInit {

    public displayedColumns: string[] = ['owner', 'name', 'description', 'startDate', 'endDate'];
    public projectId: string;
    public dataSource: SprintDataSource;
    
    constructor(
        private sprintService: SprintService,
        private route: ActivatedRoute, 
        private router: Router,
        private location: Location) 
    {
        this.route.params.subscribe(params => {
            this.projectId = params["projectId"];
        });
        
        try
        {
            let sprints: Observable<ISprint[]> = this.sprintService.getSprintsByProject(this.projectId);
            this.dataSource = new SprintDataSource(sprints);
        }
        catch(error)
        {
            this.location.back();
        }
    }

    ngOnInit(): void {
        
    }

    public navigateToCreateSprint(): void
    {
        this.router.navigate([`project/${this.projectId}/sprint/new/details`]);
    }

}
