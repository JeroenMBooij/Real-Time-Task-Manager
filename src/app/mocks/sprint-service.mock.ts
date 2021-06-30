import { Observable, of } from "rxjs";
import { ISprint } from "../models/sprint";
import { IUserstory } from "../models/userstory";

export class MockSprintService
{
    public async handleCurrentSprint(projectId: string, sprint: ISprint, activate: boolean): Promise<string>
    {
        return "There already is a sprint active";
    }

    public getCurrentSprint(projectId: string): Observable<ISprint>
    {
        return null;
    }

    public async getCurrentSprintOnce(projectId: string): Promise<ISprint>
    {
        return null;
    }

    public getSprintsByProject(projectId: string) : Observable<ISprint[]>
    {
        return of([
            
        ]);
    }

    public getSprintsByProjectOnce(projectId: string) : Promise<ISprint[]>
    {
        return null;
    }

    public getSprintById(projectId: string, sprintId: string): Observable<ISprint> 
    {
        let sprint = {} as ISprint;
        sprint.name = "test name";
        sprint.description = "test description";
        sprint.startDate = "2021-06-06";
        sprint.endDate = "2021-06-07";
        sprint.isCurrentSprint = false;
        return of(sprint);
    }

    public async getSprintByName(projectId: string, sprintName: string): Promise<ISprint> 
    {
        return null;
    }

    async getCurSprintStories(projectId: string) : Promise<Observable<IUserstory[]>> 
    {
        return null;
    }

    public async createSprint(projectId: string, username: string): Promise<Observable<ISprint>>
    {
        return new Promise((resolve, reject) => {
            let sprint = {} as ISprint;
            sprint.name = "test name";
            sprint.description = "test description";
            sprint.startDate = "2021-06-06";
            sprint.endDate = "2021-06-07";
            resolve(of(sprint));
        });
    }

    public async updateSprint(projectId: string, sprintId: string, sprint: ISprint): Promise<string>
    {
        return null;
    }

    public async deleteSprint(projectId:string, sprintId: string, sprintName: string): Promise<void>
    {
        return null;
    }
}