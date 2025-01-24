import { Component, OnInit } from '@angular/core';
//import { ScheduleService } from '../../services/schedule.service';
import { Appointment } from '../../models/appointment';
import { CommonModule } from '@angular/common';
import { ScheduleFirebaseService } from '../../services/firebase/schedule-firebase.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit{
  patientId: string = '1';
  patientAppointments: Appointment[] = [];
  paymentSuccess: boolean = false; 

  constructor(private scheduleService: ScheduleFirebaseService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    //this.loadAppointments();
    this.route.queryParams.subscribe((params) => {
      this.patientId = params['patient_id']; // Pobieranie doctorId z queryParams
      if (this.patientId) {

        this.loadAppointments();
      } else {
        console.error('patientID is missing in queryParams');
      }
    });
  }

  // Ładowanie wizyt pacjenta
  loadAppointments(): void {
    this.scheduleService.getAppointmentsForPatient(this.patientId).subscribe((appointments) => {
      this.patientAppointments = appointments;
    });
  }

  // Usuwanie wizyty
  // do wywalenia
  // removeAppointment(appointmentId: string, date: string): void {
  //   this.scheduleService.removeAppointment(this.patient_id, date, appointmentId).subscribe((success) => {
  //     if (success) {
  //       this.patientAppointements = this.patientAppointements.filter((appointment) => appointment.id !== appointmentId);
  //     }
  //   });
  // }

  // Usuwanie wizyty
  removeAppointment(appointmentId: string): void {
    const appointmentToRemove = this.patientAppointments.find(
      (appointment) => appointment.id === appointmentId
    );

    if (!appointmentToRemove) {
      alert('Appointment not found.');
      return;
    }

    this.scheduleService.removeAppointment(appointmentId).subscribe((success) => {
      if (success) {
        this.patientAppointments = this.patientAppointments.filter(
          (appointment) => appointment.id !== appointmentId
        );
        alert('Appointment removed successfully.');
      } else {
        alert('Failed to remove the appointment.');
      }
    });
  }


}
