import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AddProjectComponent } from './components/project/add-project/add-project.component';
import { ProjectOverviewComponent } from './components/project/project-overview.component';
import { UpdateProjectComponent } from './components/project/update-project/update-project.component';
import { BacklogComponent } from './components/backlog/backlog.component';
import { ScrumBoardComponent } from './components/scrumboard/scrumboard.component';
import { UserstoryDetailsComponent } from './components/userstories/userstory-details/userstory-details.component';
import { AuthGuard } from './services/auth/authguard/auth.guard';
import { NoAuthGuard } from './services/auth/authguard/no-auth.guard';
import { SprintDetailsComponent } from './components/sprint/sprint-details/sprint-details.component';
import { SprintOverviewComponent } from './components/sprint/sprint-overview/sprint-overview.component';
import { SprintAdministrationComponent } from './components/sprint/sprint-administration/sprint-administration.component';
import { UserstoriesArchiveComponent } from './components/userstories/archive/userstories-archive.component';
import { ProjectMembersOverviewComponent } from './components/project-members-overview/project-members-overview.component';
import { AddProjectMemberComponent } from './components/project-members-overview/add-project-member/add-project-member.component';
import { UpdateProjectMemberComponent } from './components/project-members-overview/update-project-member/update-project-member.component';

export const routes: Routes = [
  {path: '', redirectTo: '', pathMatch: 'full', canActivate: [AuthGuard], component: ProjectOverviewComponent},
  {path: 'login', component: LoginComponent, canActivate: [NoAuthGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard]},
  {path: 'addproject', component: AddProjectComponent, canActivate: [AuthGuard]},
  {path: 'project/:projectId/update', component: UpdateProjectComponent, canActivate: [AuthGuard]},
  {path: "project/:projectId/sprint/:sprintId/scrumboard", canActivate: [AuthGuard], component: ScrumBoardComponent},
  {path: "project/:projectId/userstory/:userstoryId/details", canActivate: [AuthGuard], component: UserstoryDetailsComponent},
  {path: "project/:projectId/scrumboard", canActivate: [AuthGuard], component: ScrumBoardComponent},
  {path: "project/:projectId/userstory/:userstoryId/details", canActivate: [AuthGuard], component: UserstoryDetailsComponent},
  {path: "project/:projectId/backlog", canActivate: [AuthGuard], component: BacklogComponent},
  {path: "project/:projectId/sprint/:sprintId/details", canActivate: [AuthGuard], component: SprintDetailsComponent},
  {path: "project/:projectId/sprints", canActivate: [AuthGuard], component: SprintOverviewComponent},
  {path: "project/:projectId/sprint/:sprintId/administration", canActivate: [AuthGuard], component: SprintAdministrationComponent},
  {path: "project/:projectId/userstories/archive", canActivate: [AuthGuard], component: UserstoriesArchiveComponent},
  {path: "project/:projectId/members", canActivate: [AuthGuard], component: ProjectMembersOverviewComponent},
  {path: "project/:projectId/members/add", canActivate: [AuthGuard], component: AddProjectMemberComponent},
  {path: "project/:projectId/members/update", canActivate: [AuthGuard], component: UpdateProjectMemberComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

