import { Component, NgModule } from '@angular/core';
import { Availability } from '../../models/availability';
import { AvailabilityService } from '../../services/availability.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';



@Component({
  selector: 'app-doctors-availability',
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ],
  templateUrl: './doctors-availability.component.html',
  styleUrl: './doctors-availability.component.css'
})
export class DoctorsAvailabilityComponent {
  currentView: 'cyclic' | 'one-time' = 'cyclic';

  doctor_id:string = '0';
  newAvailability: Availability = {
    type: this.currentView,
    startDate: '',
    endDate: '',
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    timeRanges: [],
    doctor_id: this.doctor_id
  };
  allAvailabilities: Availability[] = [];
  availableTimes: string[] = []; // Lista dostępnych godzin

  

  constructor(private availabilityService: AvailabilityService) {}

  ngOnInit(): void {
    this.loadAvailabilities();
    this.generateAvailableTimes(); // Generowanie dostępnych godzin
  }

  // Pobierz dostępności
  loadAvailabilities(): void {
    this.availabilityService.getAvailabilities().subscribe((availabilities) => {
      this.allAvailabilities = availabilities;
    });
  }

  // Dodaj nową dostępność
  addAvailability(): void {
    // if (!this.newAvailability.daysOfWeek) {
    //   this.newAvailability.daysOfWeek = [];
    // }

    if (!this.newAvailability.timeRanges || this.newAvailability.timeRanges.length === 0) {
      this.newAvailability.timeRanges = this.generateDefaultTimeRanges(); // Domyślne godziny
    }
  
    this.availabilityService.addAvailability(this.newAvailability).subscribe(() => {
      this.loadAvailabilities(); // Odśwież dostępności
      this.resetForm(); // Wyczyść formularz
    });
  }
  

  // Resetuj formularz
  resetForm(): void {
    this.newAvailability = {
      type: this.currentView,
      startDate: '',
      endDate: '',
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      timeRanges: [],
      doctor_id: this.doctor_id
    };
  }

  // Dodaj przedział czasowy
  addTimeRange(): void {
    this.newAvailability.timeRanges.push({ start: '', end: '' });
  }

  // Usuń przedział czasowy
  removeTimeRange(index: number): void {
    this.newAvailability.timeRanges.splice(index, 1);
  }

  generateDefaultTimeRanges(): { start: string; end: string }[] {
    return [{ start: '08:00', end: '14:00' }];
  }

  // Zarządzanie wyborem dni tygodnia
  toggleDaySelection(day: string): void {
    if (!this.newAvailability.daysOfWeek) {
      this.newAvailability.daysOfWeek = []; // Inicjalizacja, jeśli jest undefined
    }
  
    const index = this.newAvailability.daysOfWeek.indexOf(day);
    if (index > -1) {
      this.newAvailability.daysOfWeek.splice(index, 1); // Usuń dzień, jeśli istnieje
    } else {
      this.newAvailability.daysOfWeek.push(day); // Dodaj dzień, jeśli go nie ma
    }
  }
  

  // Generowanie dostępnych godzin od 8:00 do 15:00 co 30 minut
  generateAvailableTimes(): void {
    const startHour = 8;
    const endHour = 14;
    const stepMinutes = 30;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += stepMinutes) {
        if (hour === endHour && minutes > 0) break; // Koniec przedziału na 14:30
        const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        this.availableTimes.push(time);
      }
    }
  }
}