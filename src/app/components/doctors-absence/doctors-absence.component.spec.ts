import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAbsenceComponent } from './doctors-absence.component';

describe('DoctorsAbsenceComponent', () => {
  let component: DoctorsAbsenceComponent;
  let fixture: ComponentFixture<DoctorsAbsenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsAbsenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
