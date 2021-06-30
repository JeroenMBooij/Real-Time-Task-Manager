import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { MockUserstoryService } from 'src/app/mocks/userstory-service.mock';
import { UserstoryService } from 'src/app/services/userstory/userstory.service';
import { MaterialModule } from '../shared/modules/material/material.module';
import { ReactiveModule } from '../shared/modules/reactive/reactive.module';

import { ScrumBoardComponent } from './scrumboard.component';

describe('ScrumBoardComponent', () => {
  let component: ScrumBoardComponent;
  let fixture: ComponentFixture<ScrumBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrumBoardComponent ],
      providers: [
            { provide: UserstoryService, useClass: MockUserstoryService },
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
    fixture = TestBed.createComponent(ScrumBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
