import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/app-routing.module';
import { environment } from 'src/environments/environment';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
    ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
