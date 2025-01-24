import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFirebaseService } from '../../services/firebase/auth-firebase.service';
import { CommonModule } from '@angular/common';
import { DoctorProfile, User } from '../../models/user';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.css'
})
export class DoctorsListComponent {
  doctors: User[] = [];
  patientId:string = '';
  

  ngOnInit() {
    this.authService.getDoctors().subscribe((doctors) => {
      this.doctors = doctors;
      console.log(doctors);
      console.log(this.doctors[0].profile?.firstName);
    });
  }
  isLoggedIn: boolean = false;

  
  constructor(private router: Router, private authService: AuthFirebaseService) {
    this.authService.getCurrentUser().subscribe((user) => {
      this.isLoggedIn = !!user;
      this.patientId = user.id;
      console.log('Doctor List component patient Id' + this.patientId);
    });
  }

  viewSchedule(doctorId: string) {
    this.router.navigate(['/patient/calendar'], { queryParams: { doctor_id: doctorId, patient_id: this.patientId } });
  }
}
