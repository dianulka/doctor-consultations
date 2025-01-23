import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ScheduleService } from '../../services/schedule.service';
import { Absence } from '../../models/absence';
import { AbsenceService } from '../../services/absence.service';
import { Availability } from '../../models/availability';
import { AvailabilityService } from '../../services/availability.service';
import { inject } from '@angular/core';
import { Appointment } from '../../models/appointment';

import { AbsenceFirebaseService } from '../../services/firebase/absence-firebase.service';
import { AvailabilityFirebaseService } from '../../services/firebase/availability-firebase.service';
import { ScheduleFirebaseService } from '../../services/firebase/schedule-firebase.service';


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
    viewDate: Date = new Date(); // Obecna data
    selectedDate: Date | null = null;
    selectedStartTime: string | undefined;
    hours: string[] = []; // Przechowuje sloty czasowe
    monthDays: Date[] = []; // Przechowuje dni widoku
    public CalendarView = CalendarView;
  
    currentView: CalendarView = CalendarView.Week;
    absences: Absence[] = [];
    availabilities: Availability[] = [];
    appointments: Appointment[] = [];
    

    constructor(protected scheduleService: ScheduleFirebaseService, private absenceService: AbsenceFirebaseService, private availabilityService: AvailabilityFirebaseService) {}
  
    ngOnInit(): void {
      this.generateTimeSlots();
      this.generateView(this.currentView, this.viewDate);
      
      this.loadAvailabilities();
      this.loadAbsences(); // Pobierz nieobecności
      this.loadAppointments();
    }
  
    
  
  

    loadAppointments(): void {
      this.scheduleService.getAppointmentsRealtime().subscribe((appointments) => {
        this.appointments = appointments;
        this.updateAppointmentsWithAbsences(); // Zaktualizuj wizyty na podstawie nieobecności
        console.log('Appointments updated in real-time:', this.appointments);
      });
    }
    
    loadAbsences(): void {
      this.absenceService.getAbsencesRealtime().subscribe((absences) => {
        this.absences = absences;
        this.updateAppointmentsWithAbsences(); // Zaktualizuj status wizyt
        console.log('Absences updated in real-time:', this.absences);
      });
    }
    
    loadAvailabilities(): void {
      this.availabilityService.getAvailabilitiesRealtime().subscribe((availabilities) => {
        this.availabilities = availabilities;
        console.log('Availabilities updated in real-time:', this.availabilities);
      });
    }

    updateAppointmentsWithAbsences(): void {
      // Sprawdź, które wizyty powinny być oznaczone jako "canceled"
      this.appointments.forEach((appointment) => {
        const conflictingAbsence = this.absences.find(
          (absence) => absence.date === appointment.date && absence.doctor_id === appointment.doctor_id
        );
    
        if (conflictingAbsence) {
          // Zmień status wizyty na "canceled"
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
  
    // Ustalanie początku tygodnia (poniedziałek)
    startOfWeek(date: Date): Date {
      const start = new Date(date);
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Przesunięcie na poniedziałek
      return new Date(start.setDate(diff));
    }
  
  
    

    // Sprawdza, czy slot (lub jego zakres) jest zarezerwowany
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

  
    // Sprawdza, czy slot jest przeszły
    isPastSlot(day: Date, time: string): boolean {
      const now = new Date();
      const slotDateTime = new Date(day);
      const [hour, minute] = time.split(':').map(Number);
      slotDateTime.setHours(hour, minute, 0, 0);
      return slotDateTime < now;
    }
  
    // Wybranie slotu
    selectSlot(day: Date, time: string): void {
      console.log(`Selected slot on ${day} at ${time}`);
      this.selectedDate = day;
      this.selectedStartTime = time;
    }
  
    // Formatowanie daty do klucza harmonogramu
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
      this.monthDays = [date]; // Ustaw jeden dzień jako widoczny
    }
    
    switchToDayView(day: Date): void {
      this.viewDate = day; // Ustaw wybraną datę jako bieżący widok
      this.generateDayView(day); // Wygeneruj widok dla tego dnia
    }
  
    isCurrentSlot(day: Date, time: string): boolean {
      const now = new Date();
      const slotDate = new Date(day);
      const [hour, minute] = time.split(':').map(Number);
      slotDate.setHours(hour, minute, 0, 0);
    
      // Porównanie pełnej daty i czasu
      return slotDate.getTime() === now.setSeconds(0, 0);
    }
    
    
  
  
    isAbsence(day: Date): boolean {
      const dayKey = day.toISOString().split('T')[0];
      return this.absences.some((absence) => absence.date === dayKey);
    }
  
    isAvailable(day: Date, time: string): boolean {
      const dayKey = day.toISOString().split('T')[0];
      const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'short' }); // Skrót dnia tygodnia (np. "Mon", "Tue")
    
      return this.availabilities.some((availability) => {
        // Sprawdź, czy data mieści się w zakresie dat dla cyklicznej dostępności
        const isInDateRange =
          (!availability.startDate || availability.startDate <= dayKey) &&
          (!availability.endDate || availability.endDate >= dayKey);
    
        // Jeśli dostępność dotyczy konkretnych dni tygodnia, sprawdź je
        const isDayOfWeekAvailable =
          !availability.daysOfWeek || availability.daysOfWeek.includes(dayOfWeek);
    
        // Sprawdź, czy czas mieści się w którymś z przedziałów czasowych
        const isTimeAvailable = availability.timeRanges.some((range) => {
          return time >= range.start && time < range.end;
        });
    
        return isInDateRange && isDayOfWeekAvailable && isTimeAvailable;
      });
    }
    
    
    // loadAbsences(): void {
    //   this.absenceService.getAbsences().subscribe((absences) => {
    //     this.absences = absences;
    //   });
    // }
  
    // loadAvailabilities(): void {
    //   this.availabilityService.getAvailabilities().subscribe((availabilities) => {
    //     this.availabilities = availabilities;
    // }
    
  //   )
  //   console.log(this.availabilities);
  // }
  countAppointments(day: Date): number {
    const dayKey = day.toISOString().split('T')[0]; // Konwertuj datę na format YYYY-MM-DD
    return this.appointments.filter((appointment) => appointment.date === dayKey).length;
  }

  onHover(day: Date, time: string): void {
    // Domyślna implementacja (może być pusta)
    console.log(`Hovered on ${day} at ${time} in base-calendar`);
  }

  onLeave(): void {
    // Domyślna implementacja (może być pusta)
    console.log('Mouse left slot in base-calendar');
  }

  checkConflicts(day: Date, startTime: string, duration: number): boolean {
    const dayKey = day.toISOString().split('T')[0]; // Konwertuj datę na format YYYY-MM-DD
    const startMinutes = this.timeToMinutes(startTime); // Konwertuj czas rozpoczęcia na minuty
    const endMinutes = startMinutes + duration; // Oblicz czas zakończenia
  
    // Sprawdź, czy istnieje konflikt z innymi wizytami w danym dniu
    return this.appointments.some((appointment) => {
      if (appointment.date !== dayKey || appointment.status !== 'reserved') {
        return false; // Ignoruj wizyty z innej daty lub o innym statusie
      }
  
      const appointmentStart = this.timeToMinutes(appointment.startTime); // Początek wizyty w minutach
      const appointmentEnd = this.timeToMinutes(appointment.endTime); // Koniec wizyty w minutach
  
      // Sprawdź, czy przedziały czasowe się pokrywają
      return startMinutes < appointmentEnd && endMinutes > appointmentStart;
    });
  }
  

  timeToMinutes(time: string): number {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
  }
}
