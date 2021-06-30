export class MockAuthService {
    
    doLogin(value){
        return null
    }
  
    doRegister(value) : Promise<any> {
     return null;
    }
  
    doLogout(){
      
    }
  
    isLoggedIn() : boolean {
        return false;
    }
  
    getCurrentUser() : Promise<any> {
        return null;
    }   
}