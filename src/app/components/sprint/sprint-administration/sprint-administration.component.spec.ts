import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { MockMatDialog } from 'src/app/mocks/mat-dialog.mock';
import { MockSprintService } from 'src/app/mocks/sprint-service.mock';
import { SprintService } from 'src/app/services/sprint/sprint.service';
import { UserstoryService } from 'src/app/services/userstory/userstory.service';
import { MainButtonComponent } from '../../shared/main-button/main-button.component';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { ReactiveModule } from '../../shared/modules/reactive/reactive.module';

import { SprintAdministrationComponent } from './sprint-administration.component';
import { MockUserstoryService } from 'src/app/mocks/userstory-service.mock';

describe('SprintAdministrationComponent', () => {
    let component: SprintAdministrationComponent;
    let fixture: ComponentFixture<SprintAdministrationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ 
            SprintAdministrationComponent,
            MainButtonComponent
            ],
        providers: [
                { provide: SprintService, useClass: MockSprintService },
                { provide: UserstoryService, useClass: MockUserstoryService },
                { provide: ActivatedRoute, useValue: { params: of({id: 123}) } },
                { provide: MatDialog, useClass: MockMatDialog }
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
        fixture = TestBed.createComponent(SprintAdministrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        await component.ngOnInit();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should cancel open sprint', () => {
        component.handleCurrentSprint(true);

        expect(component.isCurrentSprint).toBeFalse();
    });

    it('should open sprint', async () => {
        let sprintService = TestBed.inject(SprintService);
        spyOn(sprintService, 'handleCurrentSprint').and.returnValue(new Promise((resolve, reject) => { resolve(null)}));
        fixture.detectChanges();

        await component.handleCurrentSprint(true);

        expect(component.isCurrentSprint).toBeTrue();
    });


});
