import { TestBed } from '@angular/core/testing';

import { AvailabilityFirebaseService } from './availability-firebase.service';

describe('AvailabilityFirebaseService', () => {
  let service: AvailabilityFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvailabilityFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
