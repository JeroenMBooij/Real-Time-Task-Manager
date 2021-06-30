import { ScrumStatus } from "src/app/models/scrum-status";

export class ScrumLane {

    public scrumStatuses: ScrumStatus[];

    constructor(scrumStatuses: ScrumStatus[]) {
        this.scrumStatuses = scrumStatuses;
    }
  }