import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { Appointment,DailySchedule } from '../../models/appointment';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit{
  patient_id: string = '101'; // Identyfikator pacjenta
  patientAppointements: Appointment[] = []; // Lista wizyt pacjenta
  paymentSuccess: boolean = false; // Flaga dla sukcesu płatności

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.loadAppointements();
  }

  // Ładowanie wizyt pacjenta
  loadAppointements(): void {
    this.scheduleService.getScheduleForPatient(this.patient_id).subscribe((patientAppointements) => {
      this.patientAppointements = patientAppointements;
    });
  }

  // Usuwanie wizyty
  removeAppointment(appointmentId: number, date: string): void {
    this.scheduleService.removeAppointment(this.patient_id, date, appointmentId).subscribe((success) => {
      if (success) {
        this.patientAppointements = this.patientAppointements.filter((appointment) => appointment.id !== appointmentId);
      }
    });
  }

  // Symulacja płatności
  simulatePayment(): void {
    if (this.patientAppointements.length > 0) {
      this.paymentSuccess = true;
      setTimeout(() => {
        this.paymentSuccess = false; // Reset komunikatu po 3 sekundach
      }, 3000);
    }
  }

}
