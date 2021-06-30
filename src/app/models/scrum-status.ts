import { IUserstory } from "src/app/models/userstory";
import { Observable } from "rxjs";

export class ScrumStatus {

    public name: string;

    public userstories: Observable<IUserstory[]>;

    constructor(name: string) {
        this.name = name;
    }

  }