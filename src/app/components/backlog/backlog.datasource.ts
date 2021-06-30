import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs/internal/Observable";
import { IUserstory } from "src/app/models/userstory";

export class UserstoryDataSource extends DataSource<IUserstory>
{
    public userstories: Observable<IUserstory[]>;

    constructor(userstories: Observable<IUserstory[]>) {
        super();
        this.userstories = userstories; 
    }

    connect(collectionViewer: CollectionViewer): Observable<IUserstory[]>
    {
        return this.userstories;
    }

    disconnect(collectionViewer: CollectionViewer): void
    {

    }
    
}