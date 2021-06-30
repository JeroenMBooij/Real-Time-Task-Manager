import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuComponent } from './navigation-menu.component';
import { routes } from 'src/app/app-routing.module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MaterialModule } from '../modules/material/material.module';
import { ReactiveModule } from '../modules/reactive/reactive.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavigationMenuComponent', () => {
  let component: NavigationMenuComponent;
  let fixture: ComponentFixture<NavigationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationMenuComponent ],
      providers: [
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
    fixture = TestBed.createComponent(NavigationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
