import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ProjectService } from 'src/app/services/project/project.service';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { ReactiveModule } from '../../shared/modules/reactive/reactive.module';

import { UpdateProjectComponent } from './update-project.component';
import { routes } from 'src/app/app-routing.module';
import { UserService } from 'src/app/services/user/user.service';
import { MockUserService } from 'src/app/mocks/user-service.mock';
import { MockProjectService } from 'src/app/mocks/project-service.mock';

describe('UpdateProjectComponent', () => {
  let component: UpdateProjectComponent;
  let fixture: ComponentFixture<UpdateProjectComponent>;
  let nameField: HTMLInputElement;
  let descriptionField: HTMLInputElement;
  let archivedField: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProjectComponent ],
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
    fixture = TestBed.createComponent(UpdateProjectComponent);
    component = fixture.componentInstance;

    nameField = fixture.debugElement.nativeElement.querySelector('#projectName');
    descriptionField = fixture.debugElement.nativeElement.querySelector('#projectDescription');
    archivedField = fixture.debugElement.nativeElement.querySelector('#projectArchived');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display name after typing it in', () => {
    //arrange
    nameField.value = 'projectName';
    
    //act
    nameField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    //assert
    expect(component.projectForm.value.name).toContain('projectName');
  });
  it('should display description after typing it in', () => {
    //arrange
    descriptionField.value = 'desc';
    
    //act
    descriptionField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    //assert
    expect(component.projectForm.value.description).toContain('desc');
  });
  it('should return false when validating a project with name, description and archivedstatus and without owner', () => {
    //arrange
    nameField.value = 'name';
    descriptionField.value = 'desc';
    delete component.project.owner;
    archivedField.value = 'false';
    
    //act
    nameField.dispatchEvent(new Event('input'));
    descriptionField.dispatchEvent(new Event('input'));
    archivedField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    //assert
    expect(component.isValid()).toBeFalse();
  });
});
