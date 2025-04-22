import { Component } from '@angular/core';
import { Absence } from '../../models/absence';
import { AbsenceService } from '../../services/absence.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbsenceFirebaseService } from '../../services/firebase/absence-firebase.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
@Component({
  selector: 'app-doctors-absence',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './doctors-absence.component.html',
  styleUrl: './doctors-absence.component.css'
})
export class DoctorsAbsenceComponent {
  doctorId:string = '';
  newAbsence: Absence = { date: '', reason: '', doctor_id: '99999' };
  absences: Absence[] = [];

  constructor(private absenceService: AbsenceFirebaseService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.doctorId = params['doctor_id']; // Pobieranie doctorId z queryParams
      if (this.doctorId) {
        console.log('Doctor absence id doctor: '+ this.doctorId);
        //this.loadAvailabilities();
        //this.loadAbsences();
        //this.loadAppointments();
        this.newAbsence.doctor_id = this.doctorId;
        this.loadAbsences();
      } else {
        console.error('doctorId is missing in queryParams');
      }
    });
    
  }

  loadAbsences(): void {
    this.absenceService.getAbsencesRealTimeForDoctor(this.doctorId).subscribe((absences) => {
      this.absences = absences;
    });
  }

  
  addAbsence(): void {
    if (this.newAbsence.date) {
      this.absenceService.addAbsence(this.newAbsence).subscribe(() => {
        this.loadAbsences();
        this.newAbsence = { date: '', reason: '',doctor_id: this.doctorId }; // Resetuj formularz
      });
    }
  }
}
