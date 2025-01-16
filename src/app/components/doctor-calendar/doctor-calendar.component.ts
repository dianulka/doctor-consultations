import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Schedule,Appointment,DailySchedule } from '../../models/appointment';
import { ScheduleService } from '../../services/schedule.service';
import { Absence } from '../../models/absence';
import { AbsenceService } from '../../services/absence.service';
import { Availability } from '../../models/availability';
import { BaseCalendarComponent } from '../base-calendar/base-calendar.component';

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
  // override onHover(day: Date, time: string): void {

  //   console.log('onHover in doctorComponent')
  //   const dayKey = day.toISOString().split('T')[0];
  //   if (this.schedule[dayKey]) {
  //     this.hoveredAppointment = this.schedule[dayKey].find(
  //       (appointment) =>
  //         appointment.startTime === time && appointment.status === 'reserved'
  //     ) || null; // Ustaw na null, jeśli brak dopasowania
  //   } else {
  //     this.hoveredAppointment = null;
  //   }
  // }

  // Obsługa najechania na slot
override onHover(day: Date, time: string): void {
  console.log('onHover in doctorComponent');
  
  const dayKey = day.toISOString().split('T')[0];
  
  if (this.schedule[dayKey]) {
    const timeInMinutes = this.timeToMinutes(time);
    
    // Znajdź wizytę, która obejmuje czas slotu
    this.hoveredAppointment = this.schedule[dayKey].find((appointment) => {
      const startMinutes = this.timeToMinutes(appointment.startTime);
      const endMinutes = this.timeToMinutes(appointment.endTime);
      
      // Sprawdź, czy czas slotu mieści się w zakresie wizyty
      return timeInMinutes >= startMinutes && timeInMinutes < endMinutes && appointment.status === 'reserved';
    }) || null; // Ustaw na null, jeśli brak dopasowania
  } else {
    this.hoveredAppointment = null;
  }
}

  // Obsługa opuszczenia slotu
  override onLeave(): void {
    this.hoveredAppointment = null;
  }

  
  
}
