import { SpyLocation } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { MockProjectService } from 'src/app/mocks/project-service.mock';
import { ProjectService } from 'src/app/services/project/project.service';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { ReactiveModule } from '../../shared/modules/reactive/reactive.module';

import { UpdateProjectMemberComponent } from './update-project-member.component';

describe('UpdateProjectMemberComponent', () => {
  let component: UpdateProjectMemberComponent;
  let fixture: ComponentFixture<UpdateProjectMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [ UpdateProjectMemberComponent ],
        providers: [
            { provide: ProjectService, useClass: MockProjectService },
            { provide: Location, useClass: SpyLocation },
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
    fixture = TestBed.createComponent(UpdateProjectMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
