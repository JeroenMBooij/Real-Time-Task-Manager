import { SpyLocation } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SprintService } from 'src/app/services/sprint/sprint.service';

import { SprintDetailsComponent } from './sprint-details.component';
import { routes } from 'src/app/app-routing.module';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { ReactiveModule } from '../../shared/modules/reactive/reactive.module';
import { DatePipe } from '@angular/common';
import { MockSprintService } from 'src/app/mocks/sprint-service.mock';
import { UserService } from 'src/app/services/user/user.service';
import { MockUserService } from 'src/app/mocks/user-service.mock';

describe('SprintDetailsComponent', () => {
    let component: SprintDetailsComponent;
    let fixture: ComponentFixture<SprintDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ SprintDetailsComponent ],
        providers: [
            { provide: SprintService, useClass: MockSprintService },
            { provide: UserService, useClass: MockUserService },
            DatePipe,
            { provide: Location, useClass: SpyLocation },
            { provide: ActivatedRoute, useValue: { params: of({sprintId: "new"}) } }
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
        fixture = TestBed.createComponent(SprintDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        await component.ngOnInit();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should invalidate form when name is empty', () => {

        component.name.setValue("");

        expect(component.sprintForm.valid).toBeFalse();
    });

    it('should invalidate form when description is empty', () => {
        component.description.setValue("");

        expect(component.sprintForm.valid).toBeFalse();
    });

    it('should invalidate form when start date is empty', () => {
        component.startDate.setValue("");

        expect(component.sprintForm.valid).toBeFalse();
    });

    it('should invalidate form when end date is empty', () => {
        component.endDate.setValue("");

        expect(component.sprintForm.valid).toBeFalse();
    });

    it('should invalidate form when start date is before end date', () => {
        component.endDate.setValue("2020-06-06");

        expect(component.sprintForm.valid).toBeFalse();
    });


    it('should validate form when not empty', () => {
            expect(component.sprintForm.valid).toBeTrue();
    });
});
