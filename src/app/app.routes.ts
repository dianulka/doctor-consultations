import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DoctorCalendarComponent } from './components/doctor-calendar/doctor-calendar.component';
import { DoctorsAvailabilityComponent } from './components/doctors-availability/doctors-availability.component';
import { DoctorsAbsenceComponent } from './components/doctors-absence/doctors-absence.component';
import { PatientCalendarComponent } from './components/patient-calendar/patient-calendar.component';
import { BasketComponent } from './components/basket/basket.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    {path: 'register', component: RegisterComponent},
    {path: 'doctor', 
        
    children: [
        { 
            path: 'calendar',
            component: DoctorCalendarComponent
        },

        {
            path: 'availability',
            component: DoctorsAvailabilityComponent
        },

        {
            path: 'absence',
            component: DoctorsAbsenceComponent
        }

    ]}, 
    { 
        path: 'patient', 
        children: [
        //   { path: 'dashboard', component: PatientDashboardComponent },
        //   { path: 'appointments', component: PatientAppointmentsComponent },
        //   { path: 'history', component: PatientHistoryComponent },
          
          // Nowy routing dla PatientCalendarComponent
          { 
            path: 'calendar', 
            component: PatientCalendarComponent 
          },
          {
            path: 'basket',
            component: BasketComponent
          }
        ]
      },
    
      { path: '**', redirectTo: '', pathMatch: 'full' }, // Fallback dla nieznanych ścieżek
];
