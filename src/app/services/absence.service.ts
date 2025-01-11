import { Injectable } from '@angular/core';
import { Absence } from '../models/absence';
import { of,Observable } from 'rxjs';
import { Appointment } from '../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {

  private absences: Absence[] = [
    {
      id: 1,
      date: '2025-01-12', // Data nieobecności
      reason: 'Vacation', // Powód nieobecności
      doctor_id: '0'
    },
    {
      id: 2,
      date: '2025-01-15', // Data nieobecności
      reason: 'Conference', // Powód nieobecności
      doctor_id: '0'
    },
    {
      id: 3,
      date: '2025-01-20', // Data nieobecności
      reason: 'Personal leave', // Powód nieobecności
      doctor_id: '0'
    },
  ]; // Lista nieobecności

  constructor() {}

  // Dodaj termin nieobecności
  addAbsence(absence: Absence): Observable<boolean> {
    this.absences.push(absence);
    return of(true);
  }

  // Pobierz wszystkie nieobecności
  getAbsences(): Observable<Absence[]> {
    return of(this.absences);
  }

  // Sprawdź konflikty z wizytami
  handleConflictsWithAppointments(
    appointments: Appointment[]
  ): Observable<Appointment[]> {
    this.absences.forEach((absence) => {
      const conflictDate = absence.date;

      appointments.forEach((appointment) => {
        if (appointment.date === conflictDate) {
          appointment.status = 'canceled'; // Oznacz wizytę jako odwołaną
        }
      });
    });

    return of(appointments); // Zwróć zaktualizowane wizyty
  }
}
