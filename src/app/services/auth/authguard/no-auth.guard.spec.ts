import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';
import { environment } from 'src/environments/environment';

import { NoAuthGuard } from './no-auth.guard';

describe('NoAuthGuard', () => {
  let guard: NoAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            RouterTestingModule.withRoutes(routes),
            AngularFireModule.initializeApp(environment.firebase),
            AngularFirestoreModule,
        ]
    });
    guard = TestBed.inject(NoAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
