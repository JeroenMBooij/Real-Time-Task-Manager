import { QuerySnapshot } from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { Member } from "../models/Member";
import { Project } from "../models/project/project";

export class MockProjectService 
{
    createProject(project: Project)
    { 
        
    }

    addProjectMember(member: Member, key)
    {
    }

    // ----------------------------- read ------------------------------  

    getProjects() : Observable<Project[]>
    {
        return null;
    }

    getProjectsOfUser(userUid: string, isArchived: boolean = false) : Observable<Project[]> {
        return of([

        ]);
    }

    getProject(key: string): Observable<Project> {
        return of(
            new Project()
        )
    }

    getProjectOnce(key: string): Promise<Project> {
        return null;
    }

    getArchivedProjects() : Observable<Project[]>{
        return null;
    }
    
    getMembersByProject(key) : Observable<Member[]>{
        return null;
    }

    async getProjectMemberUsernamesByProject(projectId: string): Promise<string[]>
    {
        return null;
    }

    async getProjectMembersByProjectPromise(projectId: string): Promise<Member[]>
    {
        return null;
    }
    getProjectMemberUsernames(projectId: string): Observable<string[]>
    {
        return null;
    }

    getMembersByProjectOnce(key) : Promise<QuerySnapshot<Member>> 
    {
        return null;
    }
    // ----------------------------- update ----------------------------

    updateProject(project: Project)
    {
        
    }

    archiveProject(key: string)
    {

    }

    deArchiveProject(key: string)
    {

    }

    UpdateProjectMember(newMember: Member, projKey: string, memberKey: string)
    {

    }

    // ----------------------------- delete ----------------------------

    deleteProject(key: string)
    {

    }

    removeMember(projectId: string, memberId: string) 
    {
        
    }
}