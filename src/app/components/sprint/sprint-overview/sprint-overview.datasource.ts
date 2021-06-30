import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs/internal/Observable";
import { ISprint } from "src/app/models/sprint";

export class SprintDataSource extends DataSource<ISprint>
{
    public sprints: Observable<ISprint[]>;

    constructor(sprints: Observable<ISprint[]>) {
        super();
        this.sprints = sprints; 
    }

    connect(collectionViewer: CollectionViewer): Observable<ISprint[]>
    {
        return this.sprints;
    }

    disconnect(collectionViewer: CollectionViewer): void
    {

    }
    
}