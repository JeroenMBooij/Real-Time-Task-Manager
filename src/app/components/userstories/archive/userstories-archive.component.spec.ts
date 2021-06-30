import { SpyLocation } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { UserstoryService } from 'src/app/services/userstory/userstory.service';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { ReactiveModule } from '../../shared/modules/reactive/reactive.module';

import { UserstoriesArchiveComponent } from './userstories-archive.component';
import { routes } from 'src/app/app-routing.module';
import { MockUserstoryService } from 'src/app/mocks/userstory-service.mock';

describe('ArchiveComponent', () => {
  let component: UserstoriesArchiveComponent;
  let fixture: ComponentFixture<UserstoriesArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserstoriesArchiveComponent ],
      providers: [
        { provide: UserstoryService, useClass: MockUserstoryService },
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
    fixture = TestBed.createComponent(UserstoriesArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
