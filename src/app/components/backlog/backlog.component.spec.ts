import { DebugElement } from '@angular/core';
import { SpyLocation } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserstoryService } from 'src/app/services/userstory/userstory.service';
import { MaterialModule } from '../shared/modules/material/material.module';
import { ReactiveModule } from '../shared/modules/reactive/reactive.module';

import { BacklogComponent } from './backlog.component';
import { routes } from 'src/app/app-routing.module';
import { of } from 'rxjs';
import { MockUserstoryService } from 'src/app/mocks/userstory-service.mock';
import { MockProjectService } from 'src/app/mocks/project-service.mock';
import { ProjectService } from 'src/app/services/project/project.service';
import { ActivatedRoute } from '@angular/router';

describe('BacklogComponent', () => {
    let component: BacklogComponent;
    let fixture: ComponentFixture<BacklogComponent>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ BacklogComponent ],
        providers: [
                { provide: UserstoryService, useClass: MockUserstoryService },
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
        fixture = TestBed.createComponent(BacklogComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
