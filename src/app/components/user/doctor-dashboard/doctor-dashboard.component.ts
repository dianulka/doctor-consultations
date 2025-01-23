import { Component } from '@angular/core';
import { User,DoctorProfile
 } from '../../../models/user';
import { AuthFirebaseService } from '../../../services/firebase/auth-firebase.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent {
  doctorData: User | null = null;
  doctorProfile: DoctorProfile | null = null;
  constructor(
    private authService: AuthFirebaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user?.role === 'Doctor') {
        this.doctorData = user;
        this.doctorProfile = user.profile as DoctorProfile; // Rzutowanie na `DoctorProfile`

      } else {
        this.router.navigate(['/not-authorized']);
      }
    });
  }

  viewCalendar() {
    this.router.navigate(['/doctor/calendar'], {
      queryParams: { doctor_id: this.doctorData?.id },
    });
  }

  manageAvailability() {
    this.router.navigate(['/doctor/availability'], {
      queryParams: { doctor_id: this.doctorData?.id },
    });
  }

  manageAbsence() {
    this.router.navigate(['/doctor/absence'], {
      queryParams: { doctor_id: this.doctorData?.id },
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
