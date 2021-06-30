import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/models/Member';
import { IUserstory } from 'src/app/models/userstory';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
  selector: 'userstory',
  templateUrl: './userstory.component.html',
  styleUrls: ['./userstory.component.scss']
})
export class UserstoryComponent implements OnInit {

    @Input() userstory: IUserstory|null = null;
    @Output() open = new EventEmitter<IUserstory>();
    

  constructor() { }

  async ngOnInit() {
  }
}