import { Injectable } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { Project } from 'src/app/models/project/project';
import { Observable } from 'rxjs';
import { Member } from 'src/app/models/Member';
import { map } from 'rxjs/operators';
import { IUserstory } from 'src/app/models/userstory';
import { ISprint } from 'src/app/models/sprint';
import * as CollectionConstant from 'src/app/models/constants/collection.constants';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth
  ){ }

  // ----------------------------- create -----------------------------
  
  createProject(project: Project)
  { 
    return this.firestore.collection<Project>(CollectionConstant.projects).add({...project});
  }

  addProjectMember(member: Member, key)
  {
    this.firestore.collection<Project>(CollectionConstant.projects).doc(key).collection<Member>(CollectionConstant.projectMembers).add({...member});
    this.firestore.collection(CollectionConstant.projects).doc(key).update({ projectMembers: firebase.firestore.FieldValue.arrayUnion(member.uid) });
  }

  // ----------------------------- read ------------------------------  

  getProjects() : Observable<Project[]>{
    return this.firestore.collection<Project>(CollectionConstant.projects, ref => ref.where("isArchived", "==", false)).valueChanges({ idField: 'id'});
  }

  getProjectsOfUser(userUid: string, isArchived: boolean = false) : Observable<Project[]> {
    return this.firestore.collection<Project>(CollectionConstant.projects, ref => 
        ref.where(CollectionConstant.projectMembers, "array-contains", userUid)).valueChanges({ idField: 'id'})
        .pipe(map(projects => projects.filter(project => project.isArchived == isArchived)));
  }

  getProject(key: string): Observable<Project> {
    return this.firestore.doc<Project>("projects/" + key).valueChanges({ idField: 'id'});
  }

  getProjectOnce(key: string): Promise<Project> {
    return new Promise((resolve, reject) => {
      this.getProject(key).subscribe(project => resolve(project));
    });
  }

  getArchivedProjects() : Observable<Project[]>{
    return this.firestore.collection<Project>(CollectionConstant.projects, ref => ref.where("isArchived", "==", true)).valueChanges({ idField: 'id'});
  }
  
  getMembersByProject(key) : Observable<Member[]>{
    return this.firestore.collection<Project>(CollectionConstant.projects).doc(key).collection<Member>(CollectionConstant.projectMembers).valueChanges({ idField: 'id'});
  }
  getMembersByProjectWithUsername(key, username) : Promise<Member[]>{
    return new Promise((resolve, reject) => {
     this.firestore.collection<Project>(CollectionConstant.projects).doc(key).collection<Member>(CollectionConstant.projectMembers, ref => ref.where("username", "==", username))
      .valueChanges({ idField: 'id'})
      .subscribe(member => resolve(member));
    });
  }

  async getProjectMemberUsernamesByProject(projectId: string): Promise<string[]>
  {
      return await new Promise((resolve, reject) => {
        this.getMembersByProject(projectId)
            .subscribe(projectMembers => resolve(projectMembers.map(s => s.username)));
    });
  }

  async getProjectMembersByProjectPromise(projectId: string): Promise<Member[]>
  {
      return await new Promise((resolve, reject) => {
        this.getMembersByProject(projectId)
            .subscribe(projectMembers => resolve(projectMembers));
    });
  }
  getProjectMemberUsernames(projectId: string): Observable<string[]>
  {
      return this.getMembersByProject(projectId).pipe(map(projectMembers => 
        { 
            return projectMembers.map(projectMember => projectMember.username)
        }));
  }

  getMembersByProjectOnce(key) : Promise<QuerySnapshot<Member>> {
    return this.firestore.collection<Project>(CollectionConstant.projects).doc(key).collection<Member>(CollectionConstant.projectMembers).get().toPromise();
  }
  // ----------------------------- update ----------------------------

  updateProject(project: Project)
  {
    return this.firestore.collection<Project>(CollectionConstant.projects).doc(project.id).update({
      "id": project.id,
      "name": project.name,
      "description": project.description,
      "owner": project.owner,
      "isArchived": project.isArchived,
      "status": project.status
    });
  }

  archiveProject(key: string)
  {
    this.firestore.collection<Project>(CollectionConstant.projects).doc(key).update({
      "isArchived": true
    });
  }

  deArchiveProject(key: string)
  {
    this.firestore.collection<Project>(CollectionConstant.projects).doc(key).update({
      "isArchived": false
    });
  }

  UpdateProjectMember(newMember: Member, projKey: string, memberKey: string)
  {
    this.firestore.collection<Project>(CollectionConstant.projects).doc(projKey).collection<Member>(CollectionConstant.projectMembers).doc(memberKey).update({
      "uid": newMember.uid,
      "username": newMember.username,
      "role": newMember.role
    });
    //check
    this.firestore.collection(CollectionConstant.projects).doc(projKey).set({ 
      projectMembers: [newMember.uid] 
    }, 
    {
      merge: true
    });
  }

  // ----------------------------- delete ----------------------------

  async deleteProject(key: string)
  {
    this.firestore.collection<Project>(CollectionConstant.projects).doc(key).collection<Member>("projectMembers")
    //first get all subcollections
    let membersPromise = this.getMembersByProjectOnce(key);
    let storiesPromise = this.firestore.collection<Project>(CollectionConstant.projects).doc(key).collection<IUserstory>(CollectionConstant.userstories).get().toPromise();
    let sprintsPromise = this.firestore.collection<Project>(CollectionConstant.projects).doc(key).collection<ISprint>(CollectionConstant.sprints).get().toPromise();
    
    let members = await membersPromise;
    if(members && members.size > 0) {
      members.docs.forEach(member => {
        member.ref.delete();
      });
    }
    let stories = await storiesPromise;
    if(stories && stories.size > 0) {
      stories.docs.forEach(story => {
        story.ref.delete();
      });
    }
    let sprints = await sprintsPromise;
    if(members && members.size > 0) {
      sprints.docs.forEach(sprint => {
        sprint.ref.delete();
      });
    }
    
    return this.firestore.collection<Project>(CollectionConstant.projects).doc(key).delete();
  }

  removeMember(projectId: string, memberId: string, memberUID: string) {
    this.firestore.collection(CollectionConstant.projects).doc(projectId).update({
      projectMembers: firebase.firestore.FieldValue.arrayRemove(memberUID)
    });
    return this.firestore.collection<Project>(CollectionConstant.projects).doc(projectId).collection<Member>(CollectionConstant.projectMembers).doc(memberId).delete();
  }

}
