import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {

    public projectId: string;
    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.projectId = params["projectId"];
        });
    }

}
