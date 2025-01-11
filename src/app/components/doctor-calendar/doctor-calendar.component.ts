import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Schedule,Appointment } from '../../models/appointment';
import { ScheduleService } from '../../services/schedule.service';
import { Absence } from '../../models/absence';
import { AbsenceService } from '../../services/absence.service';

export enum CalendarView {
  Week = 'week',
  Day = 'day',
}

@Component({
  selector: 'app-doctor-calendar',
  standalone: true,
  templateUrl: './doctor-calendar.component.html',
  styleUrls: ['./doctor-calendar.component.css'],
  imports: [CommonModule]
})
export class DoctorCalendarComponent implements OnInit {
  viewDate: Date = new Date(); // Obecna data
  selectedDate: Date | null = null;
  selectedStartTime: string | undefined;
  hours: string[] = []; // Przechowuje sloty czasowe
  monthDays: Date[] = []; // Przechowuje dni widoku
  schedule: Schedule  = {}; // Przechowuje harmonogram (dane wizyt)
  public CalendarView = CalendarView;

  currentView: CalendarView = CalendarView.Week;
  absences: Absence[] = [];

  constructor(private scheduleService: ScheduleService, private absenceService: AbsenceService) {}

  ngOnInit(): void {
    this.generateTimeSlots();
    this.generateView(this.currentView, this.viewDate);
    //this.loadMockSchedule(); // Mockowe dane wizyt
    this.loadAbsences(); // Pobierz nieobecności
    this.loadAppointments();
  }

  appointments: Appointment[] = [];


  // loadAppointments(): void {
  //   // console.log('Load all appointments');
  //   // this.scheduleService.getAllApointments().subscribe((appointments) => {
  //   //   this.appointments = appointments;
  //   // });
  //   // console.log('loadAppointments after:');
  //   // this.logAppointments(this.appointments);
  //   this.scheduleService.getSchedule().subscribe((scheduleFromService) => {
  //     this.schedule = scheduleFromService;
  //   })
  //   console.log(this.schedule);
    
  // }


  loadAppointments(): void {
    this.scheduleService.getSchedule().subscribe((scheduleFromService) => {
      this.schedule = scheduleFromService;
  
      // Aktualizuj status wizyt na "canceled" w przypadku konfliktu z nieobecnością
      Object.keys(this.schedule).forEach((date) => {
        if (this.absences.some((absence) => absence.date === date)) {
          this.schedule[date].forEach((appointment) => {
            appointment.status = 'canceled';
          });
        }
      });
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
    for (let hour = 8; hour < 15; hour++) { // Tylko 6 godzin
      for (let minutes = 0; minutes < 60; minutes += 30) {
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


  // Sprawdza, czy slot jest zarezerwowany
  isSlotReserved(day: Date, time: string): boolean {

    const dayKey = day.toISOString().split('T')[0];
    const daySchedule = this.schedule[dayKey] || [];
    return daySchedule.some((slot: any) => slot.startTime === time && slot.status === 'reserved');
    // Filtrowanie wizyt na podstawie daty
  // Sprawdzanie, czy którykolwiek slot w wyfiltrowanym harmonogramie pasuje do czasu i jest zarezerwowany
    // const daySchedule = this.appointments.filter(appointment => appointment.date === dayKey);
    // return daySchedule.some(slot => slot.startTime === time && slot.status === 'reserved');

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

    // const newDate = new Date(this.viewDate); // Utwórz nową instancję daty, aby uniknąć mutacji
    // newDate.setDate(this.viewDate.getDate() - 7); // Cofnij o 7 dni
    // this.viewDate = newDate; // Zaktualizuj datę widoku
    // this.generateWeekView(this.viewDate); // Wygeneruj nowy widok tygodnia
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
  
  hoveredAppointment: Appointment | null = null; // Szczegóły wizyty, na którą najechano

  // Obsługa najechania na slot
  onHover(day: Date, time: string): void {
    console.log('onHover')
    const dayKey = day.toISOString().split('T')[0];
    if (this.schedule[dayKey]) {
      this.hoveredAppointment = this.schedule[dayKey].find(
        (appointment) =>
          appointment.startTime === time && appointment.status === 'reserved'
      ) || null; // Ustaw na null, jeśli brak dopasowania
    } else {
      this.hoveredAppointment = null;
    }
  }

  // Obsługa opuszczenia slotu
  onLeave(): void {
    this.hoveredAppointment = null;
  }

  isAbsence(day: Date): boolean {
    const dayKey = day.toISOString().split('T')[0];
    return this.absences.some((absence) => absence.date === dayKey);
  }
  
  loadAbsences(): void {
    this.absenceService.getAbsences().subscribe((absences) => {
      this.absences = absences;
    });
  }
  
}
