import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from "@angular/router";
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private authsubscription: Subscription;
  private currentUser: any = null;

  constructor(public afAuth: AngularFireAuth,
    public router: Router) 
  {
  
    this.authsubscription = this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.authsubscription.unsubscribe();
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    });
  }

  doRegister(value) : Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if(value.password === value.repeatPassword){
        this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
          .then(res => {
            resolve(res);
          }, err => reject(err))
      }
    });
  }

  doLogout(){
    return new Promise<any>((resolve, reject) => {
      if(this.afAuth.currentUser){
          this.afAuth.signOut();
          this.router.navigate(['/login']);
          resolve(true)
        } else {
          reject() 
        }
    });
  }

  isLoggedIn() : boolean {
    return this.currentUser;
  }

  getCurrentUser() : Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let user = this.afAuth.onAuthStateChanged(function(user){
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }   
}
