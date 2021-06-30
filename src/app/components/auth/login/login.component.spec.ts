import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { ReactiveModule } from '../../shared/modules/reactive/reactive.module';

import { LoginComponent } from './login.component';
import { routes } from 'src/app/app-routing.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { MockAuthService } from 'src/app/mocks/auth-service.mock';
import { MockAlertService } from 'src/app/mocks/alert-service.mock';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let emailField: HTMLInputElement;
  let passwordField: HTMLInputElement;
  let errormessageField: HTMLElement;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: AlertService, useClass: MockAlertService }
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
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    emailField = fixture.debugElement.nativeElement.querySelector('#emailField');
    passwordField = fixture.debugElement.nativeElement.querySelector('#passwordField');
    
    fixture.detectChanges();
    
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display email after typing it in', () => {
    //arrange
    emailField.value = 'badformemailwithoutapestaart';
    
    //act
    emailField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    //assert
    //shouldn't test for specific message since the warning displayed can always change
    expect(component.loginForm.value.email).toContain('badformemailwithoutapestaart');
  });
  it('should not be valid when typing invalid invalid mail', () => {
    //arrange
    emailField.value = 'badformemailwithoutapestaart';
    
    //act
    emailField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    //assert
    expect(component.loginForm.valid).toBeFalse();
  });
  it('should not be valid when only typing valid mail', () => {
    //arrange
    emailField.value = 'badformemailwithoutapestaart';
    
    //act
    emailField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    //assert
    expect(component.loginForm.valid).toBeFalse();
  });
  it('should not be valid when only typing invalid password', () => {
    //arrange
    passwordField.value = 'bebsi';
    
    //act
    emailField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    //assert
    expect(component.loginForm.valid).toBeFalse();
  });
  it('should not be valid when only typing valid password', () => {
    //arrange
    passwordField.value = 'ProperPassword123#@!';
    
    //act
    emailField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    //assert
    expect(component.loginForm.valid).toBeFalse();
  });
  it('should be valid when typing valid email and password', () => {
    //arrange
    emailField.value = 'propermail@gmail.com';
    passwordField.value = 'ProperPassword123#@!';

    //act
    emailField.dispatchEvent(new Event('input'));
    passwordField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    //assert
    expect(component.loginForm.valid).toBeTrue();
  });
});
