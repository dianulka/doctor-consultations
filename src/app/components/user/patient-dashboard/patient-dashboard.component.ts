import { Component } from '@angular/core';
import { PatientProfile, User } from '../../../models/user';
//import { UserService } from '../../../services/firebase/user.service';
import { AuthFirebaseService } from '../../../services/firebase/auth-firebase.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent {
  patientData: User | null = null;
  patientProfile: PatientProfile | null = null;

  constructor(
      private authService: AuthFirebaseService,
      private router: Router
    ) {}

  ngOnInit(): void {
      this.authService.getCurrentUser().subscribe((user) => {
        if (user?.role === 'Patient') {
          this.patientData = user;
          this.patientProfile = user.profile as PatientProfile; 
  
        } else {
          this.router.navigate(['/not-authorized']);
        }
      });
    }

    viewDoctors() {
      this.router.navigate(['/doctors-list'], {
        queryParams: { doctor_id: this.patientData?.id },
      });
    }

    viewBasket(){
      this.router.navigate(['patient/basket'], {
        queryParams: { patient_id: this.patientData?.id },
      });
      
    }

    logout() {
      this.authService.logout().subscribe(() => {
        this.router.navigate(['/']);
      });
    }


}
