import { Observable } from "rxjs";
import { User } from "../models/user";

export class MockUserService
{
        CreateCurrentUser() 
        {

        }

        getUsersWithUID(uid: string) : Observable<User[]> {
            return null;
        }
    
        getUsersWithUsername(username: string) : Promise<User[]> {
            return null;
        }
    
        getAllUsersWithUsername(username: string) : Observable<User[]> {
            return null;
        }
    
        getCurrentUserDoc() : Promise<User[]> {
            return new Promise((resolve, reject) => {
                resolve([
                    new User()
                ]);
            });
        }
    
        getAllUsersOnce() {
            return null;
        }
}