import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { environment } from 'src/environments/environment';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  
  beforeEach(() => {
    
    TestBed.configureTestingModule({
        imports: [
            RouterTestingModule.withRoutes(routes),
            AngularFireModule.initializeApp(environment.firebase),
            AngularFirestoreModule,
        ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
