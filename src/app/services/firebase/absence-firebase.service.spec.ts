import { TestBed } from '@angular/core/testing';

import { AbsenceFirebaseService } from './absence-firebase.service';

describe('AbsenceFirebaseService', () => {
  let service: AbsenceFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbsenceFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
