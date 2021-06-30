import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { UserstoryService } from '../userstory/userstory.service';

import { SprintService } from './sprint.service';

describe('SprintService', () => {
  let service: SprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            UserstoryService
        ],
        imports: [
            AngularFireModule.initializeApp(environment.firebase),
            AngularFirestoreModule,
        ]
    });
    
    service = TestBed.inject(SprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
