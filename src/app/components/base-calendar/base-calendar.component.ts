import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';


import { Absence } from '../../models/absence';
import { AbsenceService } from '../../services/absence.service';
import { Availability } from '../../models/availability';
import { AvailabilityService } from '../../services/availability.service';
import { inject } from '@angular/core';
import { Appointment } from '../../models/appointment';

import { AbsenceFirebaseService } from '../../services/firebase/absence-firebase.service';
import { AvailabilityFirebaseService } from '../../services/firebase/availability-firebase.service';
import { ScheduleFirebaseService } from '../../services/firebase/schedule-firebase.service';
import { ActivatedRoute } from '@angular/router';

export enum CalendarView {
  Week = 'week',
  Day = 'day',
}
@Component({
  selector: 'app-base-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-calendar.component.html',
  styleUrl: './base-calendar.component.css'
})
export class BaseCalendarComponent {
    viewDate: Date = new Date();
    selectedDate: Date | null = null;
    selectedStartTime: string | undefined;
    hours: string[] = []; 
    monthDays: Date[] = [];
    public CalendarView = CalendarView;
  
    currentView: CalendarView = CalendarView.Week;
    absences: Absence[] = [];
    availabilities: Availability[] = [];
    appointments: Appointment[] = [];
    doctorId: string = '';
    

    constructor(protected scheduleService: ScheduleFirebaseService,
      protected absenceService: AbsenceFirebaseService, 
      protected availabilityService: AvailabilityFirebaseService,
      protected route: ActivatedRoute) {}
  
    ngOnInit(): void {
      this.generateTimeSlots();
      this.generateView(this.currentView, this.viewDate);
      
      // this.loadAvailabilities();
      // this.loadAbsences(); // Pobierz nieobecności
      // this.loadAppointments();
      this.route.queryParams.subscribe((params) => {
        this.doctorId = params['doctor_id']; 
        if (this.doctorId) {
          this.loadAvailabilities();
          this.loadAbsences();
          this.loadAppointments();
        } else {
          console.error('doctorId is missing in queryParams');
        }
      });
    }
  
    loadAppointments(): void {
      this.scheduleService.getAppointmentsRealtimeForDoctor(this.doctorId).subscribe((appointments) => {
        this.appointments = appointments;
        this.updateAppointmentsWithAbsences();
        console.log('Appointments updated in real-time2:', this.appointments);
      });
    }
    
    loadAbsences(): void {
      this.absenceService.getAbsencesRealTimeForDoctor(this.doctorId).subscribe((absences) => {
        this.absences = absences;
        this.updateAppointmentsWithAbsences();
        console.log('Absences updated in real-time:', this.absences);
      });
    }
    
    loadAvailabilities(): void {
      this.availabilityService.getAvailabilitiesRealtimeForDoctor(this.doctorId).subscribe((availabilities) => {
        this.availabilities = availabilities;
        console.log('Availabilities updated in real-time:', this.availabilities);
      });
    }

    updateAppointmentsWithAbsences(): void {
      this.appointments.forEach((appointment) => {
        const conflictingAbsence = this.absences.find(
          (absence) => absence.date === appointment.date
        );
    
        if (conflictingAbsence) {
          appointment.status = 'canceled';
        }
      });
    }
  
  
    logAppointments(appointments: Appointment[]): void {
      if (!appointments || appointments.length === 0) {
        console.log("No appointments to log.");
        return;
      }
    
      console.log("Appointments:");
      appointments.forEach((appointment, index) => {
        console.log(
          `#${index + 1}: ${appointment.type} from ${appointment.startTime} to ${appointment.endTime} (${appointment.status})`
        );
      });
    }

    // DLA KALENDARZA
  
    // Generowanie slotów czasowych co 30 minut
    generateTimeSlots(): void {
      for (let hour = 8; hour < 14; hour++) { // Tylko 6 godzin
        for (let minutes = 0; minutes < 60; minutes += 30) {
          if (hour === 14 && minutes > 0) break;
          const time = `${hour < 10 ? '0' : ''}${hour}:${minutes === 0 ? '00' : minutes}`;
          this.hours.push(time);
        }
      }
    }
  
    switchToView(view: CalendarView) {
      this.currentView = view;
      this.generateView(this.currentView, this.viewDate);
    }
  
    generateView(view: CalendarView, date: Date) {
      switch (view) {
        case CalendarView.Week:
          this.generateWeekView(date);
          break;
        case CalendarView.Day:
          this.generateDayView(date);
          break;
        default:
          this.generateWeekView(date);
      }
    }
  
    // Generowanie widoku tygodniowego
    generateWeekView(date: Date): void {
      const startOfWeek = this.startOfWeek(date);
      this.monthDays = [];
  
      for (let day = 0; day < 7; day++) {
        const weekDate = new Date(startOfWeek);
        weekDate.setDate(startOfWeek.getDate() + day);
        this.monthDays.push(weekDate);
      }
    }
  
    startOfWeek(date: Date): Date {
      const start = new Date(date);
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); 
      return new Date(start.setDate(diff));
    }
  
  
    

    isSlotReserved(day: Date, time: string, duration: number = 30): boolean {
      const dayKey = day.toISOString().split('T')[0];
      const startMinutes = this.timeToMinutes(time);
      const endMinutes = startMinutes + duration;
  
      return this.appointments.some((appointment) => {
        if (appointment.date !== dayKey || appointment.status !== 'reserved') {
          return false;
        }
  
        const slotStart = this.timeToMinutes(appointment.startTime);
        const slotEnd = this.timeToMinutes(appointment.endTime);
  
        return startMinutes < slotEnd && endMinutes > slotStart;
      });
    }

  
    isPastSlot(day: Date, time: string): boolean {
      const now = new Date();
      const slotDateTime = new Date(day);
      const [hour, minute] = time.split(':').map(Number);
      slotDateTime.setHours(hour, minute, 0, 0);
      return slotDateTime < now;
    }
  
    selectSlot(day: Date, time: string): void {
      console.log(`Selected slot on ${day} at ${time}`);
      this.selectedDate = day;
      this.selectedStartTime = time;
    }
  
    formatDateKey(date: Date): string {
      return date.toISOString().split('T')[0];
    }
  
    previous(): void {
  
      if (this.currentView === 'week') {
        this.viewDate = new Date(
          this.viewDate.setDate(this.viewDate.getDate() - 7)
        );
        this.generateWeekView(this.viewDate);
      } else {
        this.viewDate = new Date(
          this.viewDate.setDate(this.viewDate.getDate() - 1)
        );
        this.generateDayView(this.viewDate);
      }
    }
    
    next(): void {
      // const newDate = new Date(this.viewDate); // Utwórz nową instancję daty, aby uniknąć mutacji
      // newDate.setDate(this.viewDate.getDate() + 7); // Przesuń o 7 dni
      // this.viewDate = newDate; // Zaktualizuj datę widoku
      // this.generateWeekView(this.viewDate); // Wygeneruj nowy widok tygodnia
      if (this.currentView === 'week') {
        this.viewDate = new Date(
          this.viewDate.setDate(this.viewDate.getDate() + 7)
        );
        this.generateWeekView(this.viewDate);
      } else {
        this.viewDate = new Date(
          this.viewDate.setDate(this.viewDate.getDate() + 1)
        );
        this.generateDayView(this.viewDate);
      }
    }
  
    generateDayView(date: Date): void {
      this.monthDays = [date]; 
    }
    
    switchToDayView(day: Date): void {
      this.viewDate = day; 
      this.generateDayView(day);
    }
  
    isCurrentSlot(day: Date, time: string): boolean {
      const now = new Date();
      const slotDate = new Date(day);
      const [hour, minute] = time.split(':').map(Number);
      slotDate.setHours(hour, minute, 0, 0);
    
      return slotDate.getTime() === now.setSeconds(0, 0);
    }
    
    
  
  
    isAbsence(day: Date): boolean {
      const dayKey = day.toISOString().split('T')[0];
      return this.absences.some((absence) => absence.date === dayKey);
    }
  
    isAvailable(day: Date, time: string): boolean {
      const dayKey = day.toISOString().split('T')[0];
      const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'short' }); 
    
      return this.availabilities.some((availability) => {
        const isInDateRange =
          (!availability.startDate || availability.startDate <= dayKey) &&
          (!availability.endDate || availability.endDate >= dayKey);
    
        const isDayOfWeekAvailable =
          !availability.daysOfWeek || availability.daysOfWeek.includes(dayOfWeek);
    
        const isTimeAvailable = availability.timeRanges.some((range) => {
          return time >= range.start && time < range.end;
        });
    
        return isInDateRange && isDayOfWeekAvailable && isTimeAvailable;
      });
    }
    
    
   
  countAppointments(day: Date): number {
    const dayKey = day.toISOString().split('T')[0]; 
    return this.appointments.filter((appointment) => appointment.date === dayKey).length;
  }

  onHover(day: Date, time: string): void {
    console.log(`Hovered on ${day} at ${time} in base-calendar`);
  }

  onLeave(): void {
    console.log('Mouse left slot in base-calendar');
  }

  checkConflicts(day: Date, startTime: string, duration: number): boolean {
    const dayKey = day.toISOString().split('T')[0];
    const startMinutes = this.timeToMinutes(startTime); 
    const endMinutes = startMinutes + duration;
  
    return this.appointments.some((appointment) => {
      if (appointment.date !== dayKey || appointment.status !== 'reserved') {
        return false; 
      }
  
      const appointmentStart = this.timeToMinutes(appointment.startTime);
      const appointmentEnd = this.timeToMinutes(appointment.endTime); 
  
      return startMinutes < appointmentEnd && endMinutes > appointmentStart;
    });
  }
  

  timeToMinutes(time: string): number {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
  }
}
