import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DoctorCalendarComponent } from './components/doctor-calendar/doctor-calendar.component';
// import { AvailabilityService } from './services/availability.service';
import { DoctorsAvailabilityComponent } from './components/doctors-availability/doctors-availability.component';
import { DoctorsAbsenceComponent } from './components/doctors-absence/doctors-absence.component';
import { BasketComponent } from './components/basket/basket.component';
import { AppointmentDialogComponent } from './components/appointment-dialog/appointment-dialog.component';
import { BaseCalendarComponent } from './components/base-calendar/base-calendar.component';
import { PatientCalendarComponent } from './components/patient-calendar/patient-calendar.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthFirebaseService } from './services/firebase/auth-firebase.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DoctorCalendarComponent, DoctorsAvailabilityComponent, DoctorsAbsenceComponent,
    BasketComponent,AppointmentDialogComponent, BaseCalendarComponent, PatientCalendarComponent,RegisterComponent,
     ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'doctor-consultations';
  constructor(private authService: AuthFirebaseService) {}

  ngOnInit() {
    this.authService.initializeCurrentUser();
  }
}
