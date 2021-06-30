import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Alert } from 'src/app/models/alert';
import { AlertService } from '../../../services/alert/alert.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  alert = new Alert();

  registerForm = new FormGroup({
    email: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
    repeatPassword: new FormControl('', [
      Validators.required
    ])
  });
  
  constructor(
    public authService: AuthService,
    private alertService  : AlertService,
    private userService : UserService,
    private router: Router
  ) { }

  get email() { return this.registerForm.get('email') }

  get password() { return this.registerForm.get('password') }

  get repeatPassword() { return this.registerForm.get('repeatPassword') }

  tryRegister(value){
    this.authService.doRegister(value)
    .then(res => {
      this.userService.CreateCurrentUser();
      this.router.navigate(['']) //navigate to root page
    }, err => {
      this.alert.type = 'error';
      this.alert.message = err.message;
    })
  }
}
