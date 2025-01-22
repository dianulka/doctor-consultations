import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Appointment, } from '../../models/appointment';
import { ScheduleService } from '../../services/schedule.service';
import { Absence } from '../../models/absence';
import { AbsenceService } from '../../services/absence.service';
import { Availability } from '../../models/availability';
import { BaseCalendarComponent } from '../base-calendar/base-calendar.component';
import { ScheduleFirebaseService } from '../../services/firebase/schedule-firebase.service';

export enum CalendarView {
  Week = 'week',
  Day = 'day',
}

@Component({
  selector: 'app-doctor-calendar',
  standalone: true,
  templateUrl: './doctor-calendar.component.html',
  styleUrls: ['./doctor-calendar.component.css'],
  imports: [CommonModule, BaseCalendarComponent]
})
export class DoctorCalendarComponent extends BaseCalendarComponent {
  
  hoveredAppointment: Appointment | null = null; // Szczegóły wizyty, na którą najechano
  

  // Obsługa najechania na slot
  override onHover(day: Date, time: string): void {
    console.log('onHover in doctorComponent');
    const timeInMinutes = this.timeToMinutes(time);
    this.hoveredAppointment = this.appointments.find((appointment) => {
      const startMinutes = this.timeToMinutes(appointment.startTime);
      const endMinutes = this.timeToMinutes(appointment.endTime);

      return (
        appointment.date === day.toISOString().split('T')[0] &&
        timeInMinutes >= startMinutes &&
        timeInMinutes < endMinutes &&
        appointment.status === 'reserved'
      );
    }) || null;
  }

  // Obsługa opuszczenia slotu
  override onLeave(): void {
    this.hoveredAppointment = null;
  }

  
  
}
