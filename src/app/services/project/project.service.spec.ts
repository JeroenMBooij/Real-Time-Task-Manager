import {​ TestBed }​ from '@angular/core/testing';
import {​ AngularFireModule }​ from '@angular/fire';
import {​ AngularFirestoreModule }​ from '@angular/fire/firestore';
import {​ Member }​ from 'src/app/models/Member';
import {​ Project }​ from 'src/app/models/project/project';
import {​ roles }​ from 'src/app/models/roles';
import {​ environment }​ from 'src/environments/environment';
import {​ AuthService }​ from '../auth/auth.service';
import {​ UserService }​ from '../user/user.service';
import {​ routes }​ from 'src/app/app-routing.module';

import {​ ProjectService }​ from './project.service';
import {​ RouterTestingModule }​ from '@angular/router/testing';

const delay = ms => new Promise(res => setTimeout(res, ms));

describe('ProjectService', () => {​
  let service: ProjectService;
  let usedProject: Project;
  let authService: AuthService;

  beforeEach(() => {​
    TestBed.configureTestingModule({​
        imports: [
          RouterTestingModule.withRoutes(routes),
          AngularFireModule.initializeApp(environment.firebase),
          AngularFirestoreModule,
        ]
    }​);
    service = TestBed.inject(ProjectService);
    authService = TestBed.inject(AuthService);

    let email = 'goodname@mock.com';
    let password = 'GoodPassword123#@!';
    let repeatPassword = 'GoodPassword123#@!';
    authService.doLogin({​email, password, repeatPassword}​);
  }​);

  it('should be created', () => {​
    expect(service).toBeTruthy();
  }​);

  it('should create a project with the given data', async () => {​
    //Arrange
    usedProject = {​
      id: 'mock',
      name: 'mockproject',
      description: 'mockdesc',
      owner: 'goodname@mock.com',
      isArchived: false,
      status: 'inited',
      projectMembers: ['mockuid']
    }​

    //Act
    let returnVal = await (await service.createProject(usedProject)).get();
    await delay(500); //making sure we give firebase time to initialize the document

    let project = new Project();
    project.id = returnVal.id;
    usedProject.id = project.id;
    let returnData = returnVal.data();
    project.description = returnData.description;
    project.isArchived = returnData.isArchived;
    project.name = returnData.name;
    project.owner = returnData.owner;
    project.projectMembers = returnData.projectMembers;
    project.status = returnData.status;

    //Assert
    expect(project.name === usedProject.name).toBeTruthy();
    expect(project.description === usedProject.description).toBeTruthy();
    expect(project.owner === usedProject.owner).toBeTruthy();
    expect(project.isArchived === usedProject.isArchived).toBeTruthy();
    expect(project.status === usedProject.status).toBeTruthy();
    expect(project.projectMembers[0] === usedProject.projectMembers[0]).toBeTruthy();
  }​);
  it('should update the project with the following data', async () => {​
    //Arrange
    usedProject.name = 'completelynewmocknameblep';
    //Act
    await delay(500); //making sure we give firebase time to initialize the document
    await (await service.updateProject(usedProject));
    let project = await (await service.getProjectOnce(usedProject.id));

    //Assert
    expect(project.name === usedProject.name).toBeTruthy();
    expect(project.description === usedProject.description).toBeTruthy();
    expect(project.owner === usedProject.owner).toBeTruthy();
    expect(project.isArchived === usedProject.isArchived).toBeTruthy();
    expect(project.status === usedProject.status).toBeTruthy();
    expect(project.projectMembers[0] === usedProject.projectMembers[0]).toBeTruthy();
  }​);
  it('should add an owner to the project', async () => {​
    //Arrange
    let ownervar: Member;

    ownervar = new Member();
    ownervar.uid = 'BH0jNFE7UTMltZDy2MGMQOJuHzI2';
    ownervar.username = 'tompeters04@gmail.com';
    ownervar.role = roles.owner;

    await delay(500); //making sure we give firebase time to initialize the document
    //Act
    service.addProjectMember(ownervar, usedProject.id);
    let users = await (await (service.getMembersByProjectOnce(usedProject.id))).docs[0];
    let returnUser = users.data();
    //Assert
    expect(returnUser.username === ownervar.username).toBeTruthy();
    expect(returnUser.role === ownervar.role).toBeTruthy();
    expect(returnUser.uid === ownervar.uid).toBeTruthy();
  }​);
  it('should archive the project', async () => {​
    //Arrange
    await delay(500); //making sure we give firebase time to initialize the document

    //Act
    service.archiveProject(usedProject.id);
    let project = await (await (service.getProjectOnce(usedProject.id)));
    //Assert
    expect(project.isArchived).toBeTruthy();
  }​);
  it('should de archive the project', async () => {​
    //Arrange
    await delay(500); //making sure we give firebase time to initialize the document

    //Act
    service.deArchiveProject(usedProject.id);
    let project = await (await (service.getProjectOnce(usedProject.id)));
    //Assert
    expect(project.isArchived).toBeFalse();
  }​);

  //===========================================================[ MEMBER TESTING ]===============================================
  it('should add this member to the project', async () => {​
    //Arrange
    let member: Member;

    member = new Member();
    member.uid = 'mocknotrealUID1337';
    member.username = 'Testingmembercrudmember@gmail.com';
    member.role = roles.member;

    await delay(500); //making sure we give firebase time to initialize the document

    //Act
    service.addProjectMember(member, usedProject.id);
    let project = await (await service.getProjectOnce(usedProject.id))
    let returnUser = await (await (service.getMembersByProjectWithUsername(usedProject.id, member.username)))[0];

    //Assert
    expect(returnUser.username).toBe(member.username);
    expect(returnUser.role).toBe(member.role);
    expect(returnUser.uid).toBe(member.uid);
    expect(project.projectMembers.filter(projmember => projmember === member.uid).length > 0).toBeTrue();
  }​);

  it('should update this member of the project', async () => {​
    //Arrange
    let member: Member;

    member = new Member();
    member.uid = 'newchangeduidblup';
    member.username = 'newmailnewman@gmail.com';
    member.role = roles.admin;

    await delay(500); //making sure we give firebase time to initialize the document
    let previousmember = await (await service.getMembersByProjectWithUsername(usedProject.id, 'Testingmembercrudmember@gmail.com'));

    //Act
    service.UpdateProjectMember(member, usedProject.id, previousmember[0].id);
    let returnUser = await (await (service.getMembersByProjectWithUsername(usedProject.id, 'newmailnewman@gmail.com')))[0];

    //Assert
    expect(previousmember[0].username).toBe('Testingmembercrudmember@gmail.com');
    expect(previousmember[0].role).toBe(roles.member);
    expect(previousmember[0].uid).toBe('mocknotrealUID1337');

    expect(returnUser.username).toBe(member.username);
    expect(returnUser.role).toBe(member.role);
    expect(returnUser.uid).toBe(member.uid);
  }​);

  it('should remove this member of the project', async () => {​
    //Arrange
    await delay(500); //making sure we give firebase time to initialize the document
    let previousmember = await (await service.getMembersByProjectWithUsername(usedProject.id, 'newmailnewman@gmail.com'));
    let allPreviousMembers = await (await service.getMembersByProjectOnce(usedProject.id));

    //Act
    await service.removeMember(usedProject.id, previousmember[0].id, previousmember[0].uid);
    let returnUser = await (await (service.getMembersByProjectWithUsername(usedProject.id, 'newmailnewman@gmail.com')))[0];
    let allNewMembers = await (await service.getMembersByProjectOnce(usedProject.id));

    //Assert
    expect(allNewMembers.size).toBeLessThan(allPreviousMembers.size);
    expect(returnUser).toBeUndefined();
  }​);

  //===========================================================[ CLEANUP ]===============================================
  it('should delete a project with the given data', async () => {​
    //Act
    let project = await (await (service.getProjectOnce(usedProject.id))); //making sure we give firebase time to initialize the document
    await (await service.deleteProject(usedProject.id));
    let returnVal = await (await service.getProjectOnce(usedProject.id));

    //Assert
    expect(project).toBeTruthy();
    expect(project !== returnVal).toBeTrue();
    expect(returnVal.name).toBeUndefined();
  }​);
}​);