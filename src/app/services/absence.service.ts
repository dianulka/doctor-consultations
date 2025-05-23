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
      id: '1',
      date: '2025-01-12', // Data nieobecności
      reason: 'Vacation', // Powód nieobecności
      doctor_id: '0'
    },
    // {
    //   id:4,
    //   date: '2025-01-21',
    //   reason: 'huurf',
    //   doctor_id: '0'
    // },
    // {
    //   id: 2,
    //   date: '2025-01-15', // Data nieobecności
    //   reason: 'Conference', // Powód nieobecności
    //   doctor_id: '0'
    // },
    {
      id: '2',
      date: '2025-01-20', // Data nieobecności
      reason: 'Personal leave', // Powód nieobecności
      doctor_id: '0'
    },
  ]; // Lista nieobecności

  constructor() {}

  addAbsence(absence: Absence): Observable<boolean> {
    this.absences.push(absence);
    console.log(this.absences);
    return of(true);
  }

  getAbsences(): Observable<Absence[]> {
    return of(this.absences);
  }

  handleConflictsWithAppointments(
    appointments: Appointment[]
  ): Observable<Appointment[]> {
    this.absences.forEach((absence) => {
      const conflictDate = absence.date;

      appointments.forEach((appointment) => {
        if (appointment.date === conflictDate) {
          appointment.status = 'canceled';
        }
      });
    });

    return of(appointments);
  }
}
