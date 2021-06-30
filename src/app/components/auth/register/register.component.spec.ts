import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { MockAlertService } from 'src/app/mocks/alert-service.mock';
import { MockAuthService } from 'src/app/mocks/auth-service.mock';
import { MockUserService } from 'src/app/mocks/user-service.mock';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { ReactiveModule } from '../../shared/modules/reactive/reactive.module';

import { RegisterComponent } from './register.component';

describe('registerComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let emailField: HTMLInputElement;
  let passwordField: HTMLInputElement;
  let passwordRepeatField: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      providers: [
            { provide: UserService, useClass: MockUserService },
            { provide: AuthService, useClass: MockAuthService },
            { provide: AlertService, useClass: MockAlertService },
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
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    emailField = fixture.debugElement.nativeElement.querySelector('#emailField');
    passwordField = fixture.debugElement.nativeElement.querySelector('#passwordField');
    passwordRepeatField = fixture.debugElement.nativeElement.querySelector('#passwordRepeatField');
    
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
    expect(component.registerForm.value.email).toContain('badformemailwithoutapestaart');
  });
  it('should not be valid when typing invalid invalid mail', () => {
    //arrange
    emailField.value = 'badformemailwithoutapestaart';
    
    //act
    emailField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    //assert
    expect(component.registerForm.valid).toBeFalse();
  });
  it('should not be valid when only typing valid mail', () => {
    //arrange
    emailField.value = 'badformemailwithoutapestaart';
    
    //act
    emailField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    //assert
    expect(component.registerForm.valid).toBeFalse();
  });
  it('should not be valid when only typing invalid password', () => {
    //arrange
    passwordField.value = 'bebsi';
    
    //act
    emailField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    //assert
    expect(component.registerForm.valid).toBeFalse();
  });
  it('should not be valid when only typing valid password', () => {
    //arrange
    passwordField.value = 'ProperPassword123#@!';
    
    //act
    emailField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    //assert
    expect(component.registerForm.valid).toBeFalse();
  });
  it('should be valid when typing valid email, password and repeatPassword', () => {
    //arrange
    emailField.value = 'propermail@gmail.com';
    passwordField.value = 'ProperPassword123#@!';
    passwordRepeatField.value = 'ProperPassword123#@!';

    //act
    emailField.dispatchEvent(new Event('input'));
    passwordField.dispatchEvent(new Event('input'));
    passwordRepeatField.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    //assert
    expect(component.registerForm.valid).toBeTrue();
  });
});