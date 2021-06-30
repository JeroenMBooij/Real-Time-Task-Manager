import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { IUserstory } from 'src/app/models/userstory';
import { UserstoryService } from 'src/app/services/userstory/userstory.service';
import { UserstoryDataSource } from '../../backlog/backlog.datasource';
import * as UserstoryConstant from 'src/app/models/constants/userstory.constants';

@Component({
  selector: 'userstories-archive',
  templateUrl: './userstories-archive.component.html',
  styleUrls: ['./userstories-archive.component.scss']
})
export class UserstoriesArchiveComponent implements OnInit {
    
    public displayedColumns: string[] = ['name', 'description', 'assignee', 'status', 'points'];
    public projectId: string;
    public dataSource: UserstoryDataSource;

    constructor(
        private location: Location,
        private route: ActivatedRoute, 
        private router: Router,
        private userstoryService: UserstoryService) 
    { 
        this.route.params.subscribe(params => {
            this.projectId = params["projectId"];
        });
        
        try
        {
            let userstories: Observable<IUserstory[]> = this.userstoryService.getProjectUserstoriesByLocation(this.projectId, UserstoryConstant.archive);
            this.dataSource = new UserstoryDataSource(userstories);
        }
        catch(error)
        {
            location.back();
        }
    }

    ngOnInit(): void {  }

}
