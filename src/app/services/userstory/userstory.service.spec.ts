import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { ProjectService } from '../project/project.service';

import { UserstoryService } from './userstory.service';

describe('UserstoryService', () => {
  let service: UserstoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
              ProjectService
          ],
        imports: [
          AngularFireModule.initializeApp(environment.firebase),
          AngularFirestoreModule,
      ]
      })
    service = TestBed.inject(UserstoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
