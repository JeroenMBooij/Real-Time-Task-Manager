import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { MockProjectService } from 'src/app/mocks/project-service.mock';
import { MockUserService } from 'src/app/mocks/user-service.mock';
import { ProjectService } from 'src/app/services/project/project.service';
import { UserService } from 'src/app/services/user/user.service';
import { MaterialModule } from '../shared/modules/material/material.module';
import { ReactiveModule } from '../shared/modules/reactive/reactive.module';

import { ProjectMembersOverviewComponent } from './project-members-overview.component';

describe('ProjectMembersOverviewComponent', () => {
  let component: ProjectMembersOverviewComponent;
  let fixture: ComponentFixture<ProjectMembersOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMembersOverviewComponent ],
      providers: [
            { provide: ProjectService, useClass: MockProjectService },
            { provide: UserService, useClass: MockUserService },
            { provide: ActivatedRoute, useValue: { params: of({id: 123}) } }
        ],
      imports: [
        MaterialModule, 
        ReactiveModule,
        RouterTestingModule.withRoutes(routes)
    ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMembersOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
