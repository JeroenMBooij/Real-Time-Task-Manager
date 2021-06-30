import { Observable } from "rxjs";
import { ScrumLane } from "./scrum-lane";
import { IUserstory } from "./userstory";
import * as SprintConstant from "./constants/sprint.constants";
import { Member } from "./Member";

export class ScrumBoard {
    public columns: string[];

    public statuses: string[];

    public unAssignedTasks: Observable<IUserstory[]>;

    public assignees: Observable<string[]>;

    public scrumLanes: ScrumLane[];

    
    constructor() {
        this.columns = SprintConstant.columns;
        this.statuses = SprintConstant.statuses;

        this.scrumLanes = new Array();
    }

  }