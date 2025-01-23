import { TestBed } from '@angular/core/testing';

import { ScheduleFirebaseService } from './schedule-firebase.service';

describe('ScheduleFirebaseService', () => {
  let service: ScheduleFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
