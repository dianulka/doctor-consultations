import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DoctorCalendarComponent } from './components/doctor-calendar/doctor-calendar.component';
import { DoctorsAvailabilityComponent } from './components/doctors-availability/doctors-availability.component';
import { DoctorsAbsenceComponent } from './components/doctors-absence/doctors-absence.component';
import { PatientCalendarComponent } from './components/patient-calendar/patient-calendar.component';
import { BasketComponent } from './components/basket/basket.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { PatientDashboardComponent } from './components/user/patient-dashboard/patient-dashboard.component';
import { DoctorDashboardComponent } from './components/user/doctor-dashboard/doctor-dashboard.component';
import { AdminPanelComponent } from './components/user/admin-panel/admin-panel.component';
import { DoctorsListComponent } from './components/doctors-list/doctors-list.component';
import { RegisterDoctorComponent } from './components/auth/register-doctor/register-doctor.component';
export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    {path: 'register', component: RegisterComponent},
    { path: 'patient-dashboard', component: PatientDashboardComponent, canActivate: [AuthGuard], data: { role: 'Patient' } },
  { path: 'doctor-dashboard', component: DoctorDashboardComponent, canActivate: [AuthGuard], data: { role: 'Doctor' } },
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AuthGuard], data: { role: 'Admin' } },
    {path: 'doctors-list', component: DoctorsListComponent},
    { path: 'register-doctor', component: RegisterDoctorComponent, canActivate: [AuthGuard], data: { role: 'Admin' } },
    {path: 'doctor', canActivate: [AuthGuard], data: { role: 'Doctor' },
        
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
        path: 'patient', canActivate: [AuthGuard],
        data: { role: 'Patient' },
        children: [
       
          
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
    
      { path: '**', redirectTo: '', pathMatch: 'full' }, 
];
