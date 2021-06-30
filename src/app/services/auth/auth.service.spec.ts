import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';
import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const delay = ms => new Promise(res => setTimeout(res, ms));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
    ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should deny improper register name', async () => {
    //arrange
    let email = 'badnamewithoutapestaart';
    let password = 'MockValidPassword123#@!'
    let repeatPassword = 'MockValidPassword123#@!'
    let expectedReturn = {
      code: "auth/invalid-email",
      message: "The email address is badly formatted."
    }
    //act
    await delay(100);
    const promise = service.doRegister({email, password, repeatPassword})

    //assert
    //need to wrap in promise since angular still forces own rejection through otherwise
    let promiseHandler = await new Promise<any>((resolve, reject) => {
      promise.then(res => console.log(res)).catch(error => {
        expect(error.code).toBe(expectedReturn.code);
        expect(error.message === expectedReturn.message).toBeTrue();
        resolve(error);
        return
      })
    });
  });
  it('should deny improper register password', async () => {
    //arrange
    let email = 'goodname@mock.com';
    let password = ''
    let repeatPassword = ''
    let expectedReturn = {
      code: "auth/weak-password",
      message: "The password must be 6 characters long or more."
    }
    //act
    await delay(100);
    const promise = service.doRegister({email, password, repeatPassword})

    //assert
    //need to wrap in promise since angular still forces own rejection through otherwise
    let promiseHandler = await new Promise<any>((resolve, reject) => {
      promise.then(res => console.log(res)).catch(error => {
        expect(error.code === expectedReturn.code).toBeTrue();
        expect(error.message === expectedReturn.message).toBeTrue();
        resolve(error);
        return
      });
    });
  });
  it('should properly register a user', async () => {
    //arrange
    let email = 'goodname@mock.com';
    let password = 'GoodPassword123#@!';
    let repeatPassword = 'GoodPassword123#@!';
    let expectedReturnUser = {
      email
    }
    let expectedError = {
      code: "auth/email-already-in-use",
      message: "The email address is already in use by another account.",
      }

    //act
    await delay(100);
    const promise = service.doRegister({email, password, repeatPassword})

    //assert
    //need to wrap in promise since angular still forces own rejection through otherwise
    let promiseHandler = await new Promise<any>((resolve, reject) => {
      promise.then(res => {
        expect(res.operationType === 'signIn').toBeTrue();
        expect(res.user.email === expectedReturnUser.email).toBeTrue();
        resolve(res);
        return
        //cleanup
      }).catch(error => {
        expect(error.code === expectedError.code).toBeTrue();
        expect(error.message === expectedError.message).toBeTrue();
        console.log('please delete goodname@mock.com before re running tests...');
        resolve(error);
        //cleanup
        return
      });
    });
  });
  it('should deny improper login', async () => {
   //arrange
   let email = 'nonexistentuser@mock.com';
   let password = 'e';
   let repeatPassword = 'e';
   let expectedReturnUser = {
     email
   }
   let expectedError = {
    code: "auth/user-not-found",
    message: "There is no user record corresponding to this identifier. The user may have been deleted.",
    }
   //act
   await delay(100);
   const promise = service.doLogin({email, password, repeatPassword})

   //assert
   //need to wrap in promise since angular still forces own rejection through otherwise
   let promiseHandler = await new Promise<any>((resolve, reject) => {
     promise.then(res => {console.log('')
       //cleanup
     }).catch(error => {
      expect(error.code === expectedError.code).toBeTrue();
      expect(error.message === expectedError.message).toBeTrue();
       resolve(error);
       //cleanup
       return
     });
   });
  });
  it('should allow proper login', async () => {
    //arrange
    let email = 'goodname@mock.com';
    let password = 'GoodPassword123#@!';
    let repeatPassword = 'GoodPassword123#@!';
    let expectedReturnUser = {
      email
    }
    //act
    await delay(100);
    const promise = service.doLogin({email, password, repeatPassword})

    //assert
    //need to wrap in promise since angular still forces own rejection through otherwise
    let promiseHandler = await new Promise<any>((resolve, reject) => {
      promise.then(res => {
        expect(res.operationType === 'signIn').toBeTrue();
        expect(res.user.email === expectedReturnUser.email).toBeTrue();
        resolve(res);
        return
        //cleanup
      }).catch(error => {
        
        console.log('error', error)
        resolve(error);
        //cleanup
        return
      });
    });
  });
});
