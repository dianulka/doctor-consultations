import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCalendarComponent } from './doctor-calendar.component';

describe('DoctorCalendarComponent', () => {
  let component: DoctorCalendarComponent;
  let fixture: ComponentFixture<DoctorCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
