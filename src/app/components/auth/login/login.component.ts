import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Alert } from 'src/app/models/alert';
import { AlertService } from '../../../services/alert/alert.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  alert = new Alert();

  loginForm = new FormGroup({
    email     : new FormControl('',[
      Validators.required,
    ]),
    password  : new FormControl('',[
      Validators.required
    ]),
    });
  
  constructor(
    private authService   : AuthService,
    private alertService  : AlertService,
    public router        : Router
    ){ }

  ngOnInit(){
    this.alert = this.alertService.getAlert();
   }

   get email() { return this.loginForm.get('email') }

   get password() { return this.loginForm.get('password') }

  tryLogin(value){
    this.authService.doLogin(value)
    .then(res => {
      this.router.navigate(['']) //navigate to root page
    }).catch(err => {
      this.alert.type = 'error';
      this.alert.message = err.message;
    })
  }
}

