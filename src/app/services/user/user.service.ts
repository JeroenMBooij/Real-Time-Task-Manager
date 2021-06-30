import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { first } from 'rxjs/operators';
import * as CollectionConstant from 'src/app/models/constants/collection.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private authService: AuthService
   ){ }

    CreateCurrentUser() {
      let curUser = this.authService.getCurrentUser().then(res => {
        var user: User = new User();
        user.uid = res.uid,
        user.username = res.email //TODO: actual usernames?
        this.firestore
        .collection<User>(CollectionConstant.users)
        .add(User.toFirestore(user))
      });
    }
    getUsersWithUID(uid: string) : Observable<User[]> {
      return this.firestore.collection<User>(CollectionConstant.users, ref => ref.where('uid', '==', uid)).valueChanges({ idField: 'id'});
    }

    getUsersWithUsername(username: string) : Promise<User[]> {
      return this.getAllUsersWithUsername(username)
        .pipe(first())
        .toPromise();
    }

    getAllUsersWithUsername(username: string) : Observable<User[]> {
      return this.firestore.collection<User>(CollectionConstant.users, ref => ref.where('username', '==', username)).valueChanges({ idField: 'id'});
    }

    getCurrentUserDoc() : Promise<User[]> {
      return this.authService.getCurrentUser().then(async users => {
        return this.getUsersWithUID(users.uid).pipe(first()).toPromise();
      });
    }

    getAllUsersOnce() {
      return this.firestore.collection<User>(CollectionConstant.users).ref.get().then(res => {
        return res.docs;
      });
    }
  
}
