import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

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
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hours: string[] = []; // Przechowuje sloty czasowe
  monthDays: Date[] = []; // Przechowuje dni widoku
  schedule: any = {}; // Przechowuje harmonogram (dane wizyt)
  public CalendarView = CalendarView;

  ngOnInit(): void {
    this.generateTimeSlots();
    this.generateWeekView(this.viewDate);
    this.loadMockSchedule(); // Mockowe dane wizyt
  }

  // Generowanie slotów czasowych co 30 minut
  generateTimeSlots(): void {
    for (let hour = 8; hour <= 14; hour++) { // Tylko 6 godzin
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const time = `${hour < 10 ? '0' : ''}${hour}:${minutes === 0 ? '00' : minutes}`;
        this.hours.push(time);
      }
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

  // Załadowanie mockowych danych wizyt
  loadMockSchedule(): void {
    this.schedule = {
      '2025-01-12': [
        { startTime: '09:00', endTime: '09:30', type: 'Consultation', status: 'reserved' },
        { startTime: '11:00', endTime: '11:30', type: 'Checkup', status: 'completed' },
      ],
      '2025-01-13': [
        { startTime: '10:00', endTime: '10:30', type: 'Consultation', status: 'reserved' },
      ],
    };
  }

  // Sprawdza, czy slot jest zarezerwowany
  isSlotReserved(day: Date, time: string): boolean {
    const dayKey = day.toISOString().split('T')[0];
    const daySchedule = this.schedule[dayKey] || [];
    return daySchedule.some((slot: any) => slot.startTime === time && slot.status === 'reserved');
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

  previousWeek(): void {
    const newDate = new Date(this.viewDate); // Utwórz nową instancję daty, aby uniknąć mutacji
    newDate.setDate(this.viewDate.getDate() - 7); // Cofnij o 7 dni
    this.viewDate = newDate; // Zaktualizuj datę widoku
    this.generateWeekView(this.viewDate); // Wygeneruj nowy widok tygodnia
  }
  
  nextWeek(): void {
    const newDate = new Date(this.viewDate); // Utwórz nową instancję daty, aby uniknąć mutacji
    newDate.setDate(this.viewDate.getDate() + 7); // Przesuń o 7 dni
    this.viewDate = newDate; // Zaktualizuj datę widoku
    this.generateWeekView(this.viewDate); // Wygeneruj nowy widok tygodnia
  }
  
}
