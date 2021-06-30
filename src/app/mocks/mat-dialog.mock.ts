import { Observable, of } from "rxjs";
import * as AngularConstants from "src/app/models/constants/angular-constants";


export class MockMatDialog {

    public open(component: any, data: any)
    {
        return {
            afterClosed: () => of(AngularConstants.confirm)
          };
    }
}