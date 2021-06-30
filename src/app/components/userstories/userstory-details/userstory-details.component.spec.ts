import { SpyLocation } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { MockProjectService } from 'src/app/mocks/project-service.mock';
import { MockUserService } from 'src/app/mocks/user-service.mock';
import { MockUserstoryService } from 'src/app/mocks/userstory-service.mock';
import { IUserstory } from 'src/app/models/userstory';
import { ProjectService } from 'src/app/services/project/project.service';
import { UserstoryService } from 'src/app/services/userstory/userstory.service';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { ReactiveModule } from '../../shared/modules/reactive/reactive.module';
import * as AngularConstants from "src/app/models/constants/angular-constants";

import { UserstoryDetailsComponent } from './userstory-details.component';
import { MainButtonComponent } from '../../shared/main-button/main-button.component';

describe('UserstoryDetailsComponent', () => {
  let component: UserstoryDetailsComponent;
  let fixture: ComponentFixture<UserstoryDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ UserstoryDetailsComponent ],
        providers: [
                { provide: UserstoryService, useClass: MockUserstoryService },
                { provide: ProjectService, useClass: MockProjectService },
                { provide: Location, useClass: SpyLocation },
                { provide: ActivatedRoute, useValue: { params: of({projectId: 123, userstoryId: "new"}) } }
            ],
        imports: [
            MaterialModule, 
            ReactiveModule,
            RouterTestingModule.withRoutes(routes)
        ]
        })
        .compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(UserstoryDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await component.ngOnInit();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should invalidate form when name is empty', () => {

        component.name.setValue("");

        expect(component.userstoryForm.valid).toBeFalse();
    });

    it('should invalidate form when description is empty', () => {
        component.description.setValue("");

        expect(component.userstoryForm.valid).toBeFalse();
    });

    it('should invalidate form when storypoints is empty', () => {
        component.points.setValue("");

        expect(component.userstoryForm.valid).toBeFalse();
    });

    it('should validate form when not empty', () => {
        expect(component.userstoryForm.valid).toBeTrue();
    });

});
