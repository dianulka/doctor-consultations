import { Component } from '@angular/core';
import { BaseCalendarComponent } from '../base-calendar/base-calendar.component';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../models/appointment';
import { FormsModule } from '@angular/forms';

import { AbsenceFirebaseService } from '../../services/firebase/absence-firebase.service';
import { AvailabilityFirebaseService } from '../../services/firebase/availability-firebase.service';
import { ScheduleFirebaseService } from '../../services/firebase/schedule-firebase.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-calendar',
  standalone: true,
  imports: [CommonModule, BaseCalendarComponent, FormsModule, RouterModule],
  templateUrl: './patient-calendar.component.html',
  styleUrl: './patient-calendar.component.css'
})
export class PatientCalendarComponent extends BaseCalendarComponent {
  patientId:string = '1';
  reserveView: boolean = false; // Czy formularz rezerwacji jest widoczny
  selectedDateReserve: Date | null = null; // Wybrana data
  selectedStartTimeReserve: string | null = null; // Wybrany czas rozpoczęcia
  appointmentDuration: number = 90; // Długość konsultacji w minutach
  availableDurations: number[] = [30, 60, 90]; // Długości konsultacji do wyboru

  hoveredAppointment: Appointment | null = null; // Szczegóły wizyty, na którą najechano
  showDialog: boolean = false; // Czy dialog jest widoczny

  constructor(
    protected override scheduleService: ScheduleFirebaseService,
    protected override absenceService: AbsenceFirebaseService,
    protected override availabilityService: AvailabilityFirebaseService,
    protected override route: ActivatedRoute
  ) {
    super(scheduleService, absenceService, availabilityService, route);
  
    this.route.queryParams.subscribe((params) => {
      this.doctorId = params['doctor_id'];
      this.patientId = params['patient_id'];
      console.log(`Patient ID: ${this.patientId}, Doctor ID: ${this.doctorId}`);
    });
  }
  

  reserveAnAppointment() {
    
    this.reserveView = !this.reserveView;
  }


  cancelDialog() {
    this.showDialog = false;
    this.resetForm();
  }
  
  newAppointment: Appointment = {
    id: '',
    date: '',
    startTime: '',
    endTime: '',
    type: '',
    status: 'reserved',
    patient_id: this.patientId,
    doctor_id: this.doctorId,
    notes: '',
    patient_age: 0,
    patient_gender: '',
    patient_name: ''
    
    
  };
  
 

  override selectSlot(day: Date, time: string): void {
    if (this.reserveView && this.isAvailable(day, time) && !this.isSlotReserved(day, time) && !this.isAbsence(day)) {
      this.showDialog = true;
      this.newAppointment.date = day.toISOString().split('T')[0];
      this.newAppointment.startTime = time;
      const slotIndex = this.hours.findIndex((slotTime) => slotTime === time);

      this.availableDurations = [];
      if (slotIndex === this.hours.length - 1 
      ) {
        this.availableDurations = [30];
      } else if (slotIndex === this.hours.length - 2

      ) {
        this.availableDurations = [30, 60];
      } else {
        this.availableDurations = [30, 60, 90];
      }

      this.appointmentDuration = this.availableDurations[0];
    }
  }

  nextTimeSlot(time:string): string {
    let [hour , minutes] = time.split(':').map(Number);
    if (minutes === 30) {
      hour++;
      minutes = 0;
    } else {
      minutes = 30;
    }
    let hourString = hour.toString().padStart(2, '0');
    let minutesString = minutes.toString().padEnd(2, '0');
    let nextTime = `${hourString}:${minutesString}`;
    console.log (nextTime);
    return nextTime;

  }

  updateEndTime(): void {
    console.log('starttime' + this.newAppointment.startTime);
    if (this.newAppointment.startTime) {
      let [startHour, startMinute] = this.newAppointment.startTime.split(':').map(Number);
      console.log(startHour +' ' + startMinute);
      console.log(this.appointmentDuration);
      let endTime = new Date();
      endTime.setHours(startHour, startMinute, 0, 0);
      console.log(endTime);
      if (this.appointmentDuration == 90) {
        endTime.setMinutes(endTime.getMinutes() + 90); 
      } else if (this.appointmentDuration == 60) {
        endTime.setMinutes(endTime.getMinutes() + 60); 
      } else {
        endTime.setMinutes(endTime.getMinutes() + 30); 
      }
      console.log(endTime);
      const endHour = endTime.getHours().toString().padStart(2, '0');
      const endMinute = endTime.getMinutes().toString().padStart(2, '0');
      this.newAppointment.endTime = `${endHour}:${endMinute}`;
      console.log(this.newAppointment.endTime);
      
    }
  }
  

 submitReservation(): void {
  this.updateEndTime();

  if (!this.newAppointment.startTime || !this.newAppointment.endTime) {
    alert('Invalid appointment time');
    return;
  }

  const day = new Date(this.newAppointment.date);
  const hasConflict = this.checkConflicts(day, this.newAppointment.startTime, this.appointmentDuration-1);

  if (hasConflict) {
    alert('Conflict detected: The selected slot overlaps with another appointment.');
    return;
  }

  this.scheduleService
    .addAppointment(this.newAppointment)
    .subscribe(() => {
      alert('Appointment reserved successfully!');
      this.showDialog = false;
      this.resetForm();
      this.loadAppointments();
    });
}

resetForm(): void {
  this.newAppointment = {
    id: '',
    date: '',
    startTime: '',
    endTime: '',
    type: '',
    status: 'reserved',
    patient_id: this.patientId,
    doctor_id: this.doctorId,
    notes: '',
    patient_age: 0,
    patient_gender: '',
    patient_name: '',
  };
}
cancelAppointment(): void {
  if (this.hoveredAppointment && this.hoveredAppointment.patient_id === this.patientId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.scheduleService
        .removeAppointment(this.hoveredAppointment.id!)
        .subscribe({
          next: (success) => {
            if (success) {
              alert('Appointment canceled successfully.');
              this.appointments = this.appointments.filter(
                (appointment) => appointment.id !== this.hoveredAppointment?.id
              );
              this.hoveredAppointment = null;
            } else {
              alert('Failed to cancel the appointment.');
            }
          },
          error: (err) => {
            console.error('Error canceling appointment:', err);
            alert('Failed to cancel the appointment.');
          },
        });
    }
  } else {
    alert('You can only cancel your own appointments.');
  }
}


// Nadpisanie `onHover` dla pacjenta
override onHover(day: Date, time: string): void {
  const dayKey = day.toISOString().split('T')[0];
  this.hoveredAppointment = this.appointments.find(
    (appointment) =>
      appointment.date === dayKey &&
      appointment.startTime === time &&
      appointment.status === 'reserved'
  ) || null;
}


}
  
  


