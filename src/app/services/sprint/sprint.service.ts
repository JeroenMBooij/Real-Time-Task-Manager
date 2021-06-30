import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable } from 'rxjs/internal/Observable';
import { first, map } from 'rxjs/operators';
import { ISprint } from 'src/app/models/sprint';
import * as SprintConstant from 'src/app/models/constants/sprint.constants';
import * as CollectionConstant from 'src/app/models/constants/collection.constants';
import { IUserstory } from 'src/app/models/userstory';
import { UserstoryService } from '../userstory/userstory.service';
import * as UserstoryConstant from 'src/app/models/constants/userstory.constants'; 

@Injectable({
  providedIn: 'root'
})

export class SprintService {

    constructor(private afStore: AngularFirestore, private userstoryService: UserstoryService) 
    {  }

    public async handleCurrentSprint(projectId: string, sprint: ISprint, activate: boolean): Promise<string>
    {
        let currentSprint = await this.getCurrentSprintOnce(projectId); //!

        if(currentSprint && currentSprint.id !== sprint.id)
            return `The sprint: ${currentSprint.name} is already active. Please close this sprint before starting a new sprint.`;

        if(activate)
        {
            sprint.isCurrentSprint = activate;
            await this.updateSprint(projectId, sprint.id, sprint);
        }
        else
        {
            delete sprint.isCurrentSprint;

            await new Promise((resolve, reject) => { this.afStore.collection(CollectionConstant.projects).doc(projectId)
                .collection(CollectionConstant.sprints).doc(sprint.id)
                .update({
                    isCurrentSprint: firebase.firestore.FieldValue.delete()
                }).then(value => resolve(null))
                .catch(error => reject(error));
            });
        }


        return null;
        
    }

    public getCurrentSprint(projectId: string): Observable<ISprint>
    {
        return this.afStore.collection(CollectionConstant.projects).doc(projectId)
        .collection<ISprint>(CollectionConstant.sprints, ref => ref
        .where("isCurrentSprint", "==", true))
        .snapshotChanges()
        .pipe(
            map(actions => { 
                if(actions && actions.length > 0) {
                    const id = actions[0].payload.doc.id;
                    const data = actions[0].payload.doc.data() as ISprint;
                    return <ISprint> {
                        id, ...data
                    };
                }
                else return undefined;
            })
        );
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
                        return <ISprint> {
                            id, ...data
                        };
                    });
                })
            ).subscribe(sprints => resolve(sprints[0]));
        });
    }

    public getSprintsByProject(projectId: string) : Observable<ISprint[]>
    {
        return this.afStore.collection(CollectionConstant.projects).doc(projectId)
            .collection<ISprint>(CollectionConstant.sprints).valueChanges({ idField: 'id'});
    }

    public getSprintsByProjectOnce(projectId: string) : Promise<ISprint[]>
    {
        return new Promise((resolve, reject) => {
            this.afStore.collection(CollectionConstant.projects).doc(projectId)
                .collection<ISprint>(CollectionConstant.sprints).valueChanges({ idField: 'id'}).subscribe(sprints => resolve(sprints));
        });
    }

    public getSprintById(projectId: string, sprintId: string): Observable<ISprint> 
    {
        return this.afStore
                .doc<ISprint>(`${CollectionConstant.projects}/${projectId}/${CollectionConstant.sprints}/${sprintId}`)
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

    public async getSprintByName(projectId: string, sprintName: string): Promise<ISprint> 
    {
        return await new Promise((resolve, reject) => {
            this.afStore.collection(CollectionConstant.projects).doc(projectId)
            .collection(CollectionConstant.sprints, ref => ref
            .where("name", "==", sprintName))
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

    async getCurSprintStories(projectId: string) : Promise<Observable<IUserstory[]>> {
        const curSprint = await this.getCurrentSprintOnce(projectId);
        if(curSprint)
            return this.afStore.collection(CollectionConstant.projects).doc(projectId)
                .collection<IUserstory>(CollectionConstant.userstories, ref => ref
                .where("location", "==", curSprint.name))
                .valueChanges({ idField: "id"});
        return undefined;
    }

    public async createSprint(projectId: string, username: string): Promise<Observable<ISprint>>
    {
        let sprint =  {} as ISprint;
        while (true)
        {
            sprint.name = `${SprintConstant.templateName} ${(Math.floor(Math.random() * 1000)) + 1}`
            sprint.description = SprintConstant.templateDescription;
            sprint.owner = username;

            let today = new Date();
            sprint.startDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().length < 2 
                ? '0' + (today.getMonth() + 1) 
                : (today.getMonth() + 1)}-${today.getDate().toString().length < 2 
                    ? '0' + (today.getDate() )
                    : today.getDate() }`;

            let tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 7)
            sprint.endDate = `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().length < 2 
                ? '0' + (tomorrow.getMonth() + 1) 
                : (tomorrow.getMonth() + 1)}-${tomorrow.getDate().toString().length < 2 
                    ? '0' + (tomorrow.getDate()) 
                    : tomorrow.getDate() }`;

            let sprintConstraint = await this.getSprintByName(projectId, sprint.name);
            if(sprintConstraint == null)
                break;
        }

        return await this.afStore.collection(CollectionConstant.projects).doc(projectId)
                .collection(CollectionConstant.sprints).add(sprint)
                .then(document => this.getSprintById(projectId, document.id));
    }

    public async updateSprint(projectId: string, sprintId: string, sprint: ISprint): Promise<string>
    {
        let sprintConstraint = await this.getSprintByName(projectId, sprint.name);

        if(sprintConstraint && sprintConstraint.id != sprintId)
            return `There already is a sprint: ${sprint.name}`;

        let previousSprintData: ISprint = await new Promise((resolve, reject) => {
            this.getSprintById(projectId, sprintId).subscribe(document => resolve(document));
        });

        delete sprint.id;

        await this.afStore.firestore.runTransaction(() => {
            const promise = Promise.all([
                this.afStore.collection(CollectionConstant.projects).doc(projectId)
                    .collection(CollectionConstant.sprints).doc(sprintId).update(sprint),

                this.userstoryService.updateLocationInUserStories(projectId, previousSprintData.name, sprint.name)
            ]);

            return promise;
        });
        
        sprint.id = sprintId;

        return null;
    }

    public async deleteSprint(projectId:string, sprintId: string, sprintName: string): Promise<void>
    {
        await this.afStore.firestore.runTransaction(() => {
            const promise = Promise.all([
            this.userstoryService.updateLocationInUserStories(projectId, sprintName, UserstoryConstant.backlog),

            this.afStore.collection(CollectionConstant.projects).doc(projectId)
                .collection(CollectionConstant.sprints).doc(sprintId)
                .delete()
            ]);

            return promise;
        });
    }
}
