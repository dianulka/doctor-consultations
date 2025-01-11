import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAvailabilityComponent } from './doctors-availability.component';

describe('DoctorsAvailabilityComponent', () => {
  let component: DoctorsAvailabilityComponent;
  let fixture: ComponentFixture<DoctorsAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
