import { SpyLocation } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SprintService } from 'src/app/services/sprint/sprint.service';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { ReactiveModule } from '../../shared/modules/reactive/reactive.module';

import { SprintOverviewComponent } from './sprint-overview.component';
import { routes } from 'src/app/app-routing.module';
import { MockSprintService } from 'src/app/mocks/sprint-service.mock';

describe('SprintOverviewComponent', () => {
  let component: SprintOverviewComponent;
  let fixture: ComponentFixture<SprintOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SprintOverviewComponent ],
      providers: [
            { provide: SprintService, useClass: MockSprintService },
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
    fixture = TestBed.createComponent(SprintOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
