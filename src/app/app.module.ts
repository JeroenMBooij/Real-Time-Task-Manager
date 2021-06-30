import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './components/shared/header/header.component';
import { MainButtonComponent } from './components/shared/main-button/main-button.component';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { UserstoryComponent } from './components/userstories/userstory/userstory.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { UserstoryDetailsComponent } from './components/userstories/userstory-details/userstory-details.component';
import { ScrumBoardComponent } from './components/scrumboard/scrumboard.component';
import { AddProjectComponent } from './components/project/add-project/add-project.component';
import { UpdateProjectComponent } from './components/project/update-project/update-project.component';
import { ProjectOverviewComponent } from './components/project/project-overview.component';
import { BacklogComponent } from './components/backlog/backlog.component';
import { NavigationMenuComponent } from './components/shared/navigation-menu/navigation-menu.component';
import { UserstoriesArchiveComponent } from './components/userstories/archive/userstories-archive.component';
import { ProjectMembersOverviewComponent } from './components/project-members-overview/project-members-overview.component';
import { AddProjectMemberComponent } from './components/project-members-overview/add-project-member/add-project-member.component';
import { UpdateProjectMemberComponent } from './components/project-members-overview/update-project-member/update-project-member.component';
import { SprintDetailsComponent } from './components/sprint/sprint-details/sprint-details.component';
import { SprintOverviewComponent } from './components/sprint/sprint-overview/sprint-overview.component';
import { SprintAdministrationComponent } from './components/sprint/sprint-administration/sprint-administration.component';

import { MaterialModule } from './components/shared/modules/material/material.module';
import { ReactiveModule } from './components/shared/modules/reactive/reactive.module';
import { BurndownchartComponent } from './components/burndownchart/burndownchart.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainButtonComponent,
    UserstoryComponent,
    LoginComponent,
    RegisterComponent,
    ScrumBoardComponent,
    UserstoryComponent,
    UserstoryDetailsComponent,
    AddProjectComponent,
    UpdateProjectComponent,
    ProjectOverviewComponent,
    BacklogComponent,
    NavigationMenuComponent,
    SprintDetailsComponent,
    SprintOverviewComponent,
    SprintAdministrationComponent,
    UserstoriesArchiveComponent,
    ProjectMembersOverviewComponent,
    AddProjectMemberComponent,
    UpdateProjectMemberComponent,
    BurndownchartComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    MaterialModule,
    ReactiveModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
