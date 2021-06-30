import { Observable, of } from "rxjs";
import { ScrumBoard } from "../models/scrumboard";
import { ISprint } from "../models/sprint";
import { IUserstory } from "../models/userstory";
import * as UserstoryConstants from "src/app/models/constants/userstory.constants";

export class MockUserstoryService
{
    public getProjectUserstoriesByLocation(projectId: string, location: string): Observable<IUserstory[]>
    {
        return of([

        ]);
    }
    public async getCurrentSprintOnce(projectId: string): Promise<ISprint>
    {
        return null;
    }
    public async getScrumboardData(projectId: string): Promise<ScrumBoard>
    {
        return await new Promise((resolve, reject) => 
        { 
            resolve(new ScrumBoard()) 
        });
    }

    private async getCurrentSprint(projectId: string): Promise<ISprint>
    {
        return null;
    }

    public getUserstoryById(projectId: string, userstoryId: string): Observable<IUserstory> 
    {
        return null;
    }

    public async createUserstory(projectId: string): Promise<Observable<IUserstory>>
    {
        return await new Promise((resolve, reject) => {
            var userstory = {} as IUserstory;
            userstory.name = "test name";
            userstory.description = "test description";
            userstory.location = UserstoryConstants.backlog;
            userstory.status = UserstoryConstants.todo;
            userstory.storypoints = 1;

            resolve(of(userstory))
        });
    }

    public updateUserstory(projectId:string, userstoryId: string, userstory: IUserstory)
    {
        
    }

    public updateLocationInUserStories(projectId: string, sprintName: string, location: string): Promise<void>
    {
        return null;
    }

    public async deleteUserstory(projectId:string, userstoryId: string): Promise<void>
    {
        return null;
    }
}