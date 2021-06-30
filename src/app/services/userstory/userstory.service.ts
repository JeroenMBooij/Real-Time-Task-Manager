import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { IUserstory } from 'src/app/models/userstory';
import { first, map } from 'rxjs/operators';
import { ScrumLane } from 'src/app/models/scrum-lane';
import { ScrumStatus } from 'src/app/models/scrum-status';
import * as SprintConstant from 'src/app/models/constants/sprint.constants';
import * as UserstoryConstant from 'src/app/models/constants/userstory.constants';
import * as CollectionConstant from 'src/app/models/constants/collection.constants';
import { ScrumBoard } from 'src/app/models/scrumboard';
import { ProjectService } from '../project/project.service';
import { ISprint } from 'src/app/models/sprint';

@Injectable({
  providedIn: 'root'
})

export class UserstoryService 
{
    constructor(private afStore: AngularFirestore, private projectService: ProjectService) 
    {  }

    public getProjectUserstoriesByLocation(projectId: string, location: string): Observable<IUserstory[]>
    {
        return this.afStore.collection(CollectionConstant.projects).doc(projectId)
            .collection(CollectionConstant.userstories, ref => ref
            .where("location", "==", location))
            .snapshotChanges()
            .pipe(
                map(actions => { 
                    return actions.map(action => {
                        const id = action.payload.doc.id;
                        const data = action.payload.doc.data() as IUserstory;
                        return <IUserstory> {
                            id, ...data
                        };
                    });
                })
            );
    }
    public getProjectUserstoriesByLocationOnce(projectId: string, location: string): Promise<IUserstory[]>
    {
        return new Promise((resolve, reject) => { 
            this.afStore.collection(CollectionConstant.projects).doc(projectId)
            .collection(CollectionConstant.userstories, ref => ref
            .where("location", "==", location))
            .snapshotChanges()
            .pipe(
                map(actions => { 
                    return actions.map(action => {
                        const id = action.payload.doc.id;
                        const data = action.payload.doc.data() as IUserstory;
                        return <IUserstory> {
                            id, ...data
                        };
                    });
                })
            ).subscribe(userstories => resolve(userstories));
        });
    }
    public async getCurrentSprintOnce(projectId: string): Promise<ISprint>
    {
        return new Promise((resolve, reject) => {
            this.afStore.collection(CollectionConstant.projects).doc(projectId)
            .collection(CollectionConstant.sprints, ref => ref
            .where("isCurrentSprint", "==", true))
            .snapshotChanges()
            .pipe(
                map(actions => { 
                    return actions.map(action => {
                        const id = action.payload.doc.id;
                        const data = action.payload.doc.data() as ISprint;

                        if(data == undefined)
                            reject(null);

                        return <ISprint> {
                            id, ...data
                        };
                    });
                })
            ).subscribe(sprints => resolve(sprints[0]));
        });
    }
    public async getScrumboardData(projectId: string): Promise<ScrumBoard>
    {
        let scrumboard = new ScrumBoard();
        let currentSprint: ISprint = await this.getCurrentSprint(projectId);

        if(currentSprint == null)
            return null;

        scrumboard.unAssignedTasks = this.afStore.collection(CollectionConstant.projects).doc(projectId)
            .collection(CollectionConstant.userstories, ref => ref
            .where("location", "==", currentSprint.name)
            .where("assignee", "==", UserstoryConstant.unAssigned))
            .snapshotChanges()
            .pipe(
                map(actions => { 
                    return actions.map(action => {
                        const id = action.payload.doc.id;
                        const data = action.payload.doc.data() as IUserstory;
                        return <IUserstory> {
                            id, ...data
                        };
                    });
                })
            );  
            
        scrumboard.assignees = this.projectService.getMembersByProject(projectId)
            .pipe(map(projectMembers => 
            { 
                return projectMembers.map(projectMember => 
                {
                    let lane: ScrumStatus[] = new Array();
                        SprintConstant.statuses.forEach(status => {
                            let userstories = this.afStore.collection(CollectionConstant.projects).doc(projectId)
                                .collection(CollectionConstant.userstories, ref => ref
                                .where("location", "==", currentSprint.name)
                                .where("status", "==", status)
                                .where("assignee", "==", projectMember.username))
                                .snapshotChanges()
                                .pipe(
                                    map(actions => { 
                                        return actions.map(action => {
                                            const id = action.payload.doc.id;
                                            const data = action.payload.doc.data() as IUserstory;
                                            return <IUserstory> {
                                                id, ...data
                                            };
                                        });
                                    })
                                );
                            
                            let scrumStatus = new ScrumStatus(status);
                            scrumStatus.userstories = userstories;
                            lane.push(scrumStatus);
                
                        });

                        let scrumLane = new ScrumLane(lane);
                        scrumboard.scrumLanes.push(scrumLane);

                        return projectMember.username;
                    })
                })
            );

        return scrumboard;
    }

    private async getCurrentSprint(projectId: string): Promise<ISprint>
    {
        return new Promise((resolve, reject) => {
            this.afStore.collection(CollectionConstant.projects).doc(projectId)
            .collection(CollectionConstant.sprints, ref => ref
            .where("isCurrentSprint", "==", true))
            .snapshotChanges()
            .pipe(
                map(actions => { 
                    return actions.map(action => {
                        const id = action.payload.doc.id;
                        const data = action.payload.doc.data() as ISprint;

                        if(data == undefined)
                            reject(null);

                        return <ISprint> {
                            id, ...data
                        };
                    });
                })
            ).subscribe(sprints => resolve(sprints[0]));
        });
    }

    public getUserstoryById(projectId: string, userstoryId: string): Observable<IUserstory> 
    {
        return this.afStore
            .doc<IUserstory>(`${CollectionConstant.projects}/${projectId}/${CollectionConstant.userstories}/${userstoryId}`)
            .snapshotChanges()
            .pipe(
                map(changes => {
                    const data = changes.payload.data();
                    const id = changes.payload.id;
                        
                    return { id, ...data };
                }),
                first()
            );
    }

    public async createUserstory(projectId: string): Promise<Observable<IUserstory>>
    {
        var userstory = {} as IUserstory;
        userstory.name = UserstoryConstant.templateName;
        userstory.location = UserstoryConstant.backlog;
        userstory.description = UserstoryConstant.templateDescription;
        userstory.status = UserstoryConstant.todo;
        userstory.storypoints = 1;
        userstory.assignee = UserstoryConstant.unAssigned;

        return await this.afStore.collection(CollectionConstant.projects).doc(projectId)
            .collection(CollectionConstant.userstories).add(userstory)
            .then(document => this.getUserstoryById(projectId, document.id));
    }

    public updateUserstory(projectId:string, userstoryId: string, userstory: IUserstory)
    {
        delete userstory.id;

        this.afStore.collection(CollectionConstant.projects).doc(projectId)
            .collection(CollectionConstant.userstories).doc(userstoryId).update(userstory);

        userstory.id = userstoryId;
    }

    public async updateLocationInUserStories(projectId: string, sprintName: string, location: string): Promise<void>
    {
        let stories = await this.getProjectUserstoriesByLocationOnce(projectId, sprintName);
        stories.forEach(userstory => {
                userstory.location = location
                let userstoryId = userstory.id;
                delete userstory.id;
                this.afStore.collection(CollectionConstant.projects).doc(projectId)
                    .collection(CollectionConstant.userstories).doc(userstoryId).update(userstory);
            })
    }

    public async deleteUserstory(projectId:string, userstoryId: string): Promise<void>
    {
        await this.afStore.collection(CollectionConstant.projects).doc(projectId)
            .collection(CollectionConstant.userstories).doc(userstoryId)
            .delete()
    }

}
