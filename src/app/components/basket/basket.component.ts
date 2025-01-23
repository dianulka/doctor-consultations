import { Component, OnInit } from '@angular/core';
//import { ScheduleService } from '../../services/schedule.service';
import { Appointment } from '../../models/appointment';
import { CommonModule } from '@angular/common';
import { ScheduleFirebaseService } from '../../services/firebase/schedule-firebase.service';
@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit{
  patient_id: string = '1'; // Identyfikator pacjenta
  patientAppointments: Appointment[] = []; // Lista wizyt pacjenta
  paymentSuccess: boolean = false; // Flaga dla sukcesu płatności

  constructor(private scheduleService: ScheduleFirebaseService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  // Ładowanie wizyt pacjenta
  loadAppointments(): void {
    this.scheduleService.getAppointmentsForPatient(this.patient_id).subscribe((appointments) => {
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


  // Symulacja płatności
  simulatePayment(): void {
    if (this.patientAppointments.length > 0) {
      this.paymentSuccess = true;
      alert('Payment successful!');

      // Reset komunikatu po 3 sekundach
      setTimeout(() => {
        this.paymentSuccess = false;
      }, 3000);
    } else {
      alert('No appointments to pay for.');
    }
  }

}
