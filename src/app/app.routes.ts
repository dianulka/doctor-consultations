import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DoctorCalendarComponent } from './components/doctor-calendar/doctor-calendar.component';
import { DoctorsAvailabilityComponent } from './components/doctors-availability/doctors-availability.component';
import { DoctorsAbsenceComponent } from './components/doctors-absence/doctors-absence.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },

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



    ]}
];
