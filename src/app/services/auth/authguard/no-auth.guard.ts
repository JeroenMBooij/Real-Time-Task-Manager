import { Injectable } from '@angular/core';
import { CanActivate, Router } from "@angular/router";
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate { //used when a user must be logged out to acces a page

  constructor(
    public afAuth: AngularFireAuth,
    public authService: AuthService,
    public router: Router
  ) { }

  canActivate(): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser()
      .then(user => {
        this.router.navigate(['']);
        return resolve(false);
      }, err => {
        return resolve(true);
      })
    })
  }
}
