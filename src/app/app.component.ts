import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DoctorCalendarComponent } from './components/doctor-calendar/doctor-calendar.component';
import { AvailabilityService } from './services/availability.service';
import { DoctorsAvailabilityComponent } from './components/doctors-availability/doctors-availability.component';
import { DoctorsAbsenceComponent } from './components/doctors-absence/doctors-absence.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DoctorCalendarComponent, DoctorsAvailabilityComponent, DoctorsAbsenceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'doctor-consultations';
}
