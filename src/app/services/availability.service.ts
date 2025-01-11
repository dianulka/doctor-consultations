import { Injectable } from '@angular/core';
import { Availability } from '../models/availability';
import { of,Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  private availabilities: Availability[] = [
    {
      id: 1,
      type: 'cyclic',
      startDate: '2025-02-01',
      endDate: '2025-03-12',
      daysOfWeek: ['Mon', 'Wed', 'Fri'], // Przykładowe dni tygodnia
      timeRanges: [
        { start: '08:30', end: '09:00' },
        { start: '09:00', end: '09:30' },
        { start: '09:30', end: '10:00' },
        { start: '10:00', end: '10:30' },
        { start: '10:30', end: '11:00' },
        { start: '11:00', end: '11:30' },
        { start: '11:30', end: '12:00' },
        { start: '12:00', end: '12:30' },
        { start: '12:30', end: '13:00' },
        { start: '13:00', end: '13:30' },
        { start: '13:30', end: '14:00' },
      ],
    },
    {
      id: 2,
      type: 'one-time',
      startDate: '2025-02-15',
      timeRanges: [
        { start: '08:30', end: '09:00' },
        { start: '09:00', end: '09:30' },
        { start: '09:30', end: '10:00' },
        { start: '10:00', end: '10:30' },
        { start: '10:30', end: '11:00' },
        { start: '11:00', end: '11:30' },
        { start: '11:30', end: '12:00' },
        { start: '12:00', end: '12:30' },
        { start: '12:30', end: '13:00' },
        { start: '13:00', end: '13:30' },
        { start: '13:30', end: '14:00' },
      ],
    },
  ]; // Przechowuje dostępności

  constructor() {}

  // Dodaj dostępność
  addAvailability(availability: Availability): Observable<boolean> {
    availability.id = this.availabilities.length + 1; // Generowanie ID
    this.availabilities.push(availability);
    return of(true);
  }

  // Pobierz wszystkie dostępności
  getAvailabilities(): Observable<Availability[]> {
    return of(this.availabilities);
  }
}
