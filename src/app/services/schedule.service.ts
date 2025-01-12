import { Injectable } from '@angular/core';
import { Observable,of, Scheduler } from 'rxjs';
import { Schedule,Appointment,DailySchedule } from '../models/appointment';
import { HttpClient } from '@angular/common/http';




@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private apiUrl = 'http://localhost:3000';

  private schedule: Schedule = {
    '0': {
      '2025-01-14': [
        {
          id: 1,
          date: '2025-01-14',
          startTime: '08:00',
          endTime: '09:30',
          type: 'Consultation',
          status: 'reserved',
          patient_id: '100',
          doctor_id: '0',
        },
        {
          id: 1,
          date: '2025-01-14',
          startTime: '09:00',
          endTime: '09:30',
          type: 'Consultation',
          status: 'reserved',
          patient_id: '100',
          doctor_id: '0',
        },
        {
          id: 2,
          date: '2025-01-14',
          startTime: '11:00',
          endTime: '12:30',
          type: 'Checkup',
          status: 'reserved',
          patient_id: '100',
          doctor_id: '0',
        },
      ],
      '2025-01-13': [
        {
          id: 0,
          date: '2025-01-13',
          startTime: '10:00',
          endTime: '10:30',
          type: 'Consultation',
          status: 'reserved',
          patient_id: '100',
          doctor_id: '0',
        },
        {
          id: 4,
          date: '2025-01-13',
          startTime: '11:00',
          endTime: '11:30',
          type: 'Consultation',
          status: 'reserved',
          patient_id: '100',
          doctor_id: '0',
        },
      ],
      '2025-01-15': [
        {
          id: 0,
          date: '2025-01-13',
          startTime: '10:00',
          endTime: '10:30',
          type: 'Consultation',
          status: 'reserved',
          patient_id: '100',
          doctor_id: '0',
        },
        {
          id: 4,
          date: '2025-01-13',
          startTime: '11:00',
          endTime: '11:30',
          type: 'Consultation',
          status: 'reserved',
          patient_id: '100',
          doctor_id: '0',
        },
      ],
      '2025-01-16': [
        {
          id: 0,
          date: '2025-01-13',
          startTime: '13:00',
          endTime: '13:30',
          type: 'Consultation',
          status: 'reserved',
          patient_id: '100',
          doctor_id: '0',
        },
        {
          id: 4,
          date: '2025-01-13',
          startTime: '11:00',
          endTime: '11:30',
          type: 'Consultation',
          status: 'reserved',
          patient_id: '100',
          doctor_id: '0',
        },
      ],
    },
    '1': {
      '2025-01-12': [
        {
          id: 3,
          date: '2025-01-12',
          startTime: '09:00',
          endTime: '09:30',
          type: 'Consultation',
          status: 'reserved',
          patient_id: '101',
          doctor_id: '1',
        },
      ],
    },
  };

  
  constructor() {}

  /**
   * Pobierz cały harmonogram dla danego lekarza
   */
  getScheduleForDoctor(doctorId: string): Observable<DailySchedule> {
    return of(this.schedule[doctorId] || {});
  }

  /**
   * Pobierz wszystkie wizyty dla danego lekarza
   */
  getAllAppointmentsForDoctor(doctorId: string): Observable<Appointment[]> {
    const doctorSchedule = this.schedule[doctorId] || {};
    const appointments = Object.values(doctorSchedule).flat();
    return of(appointments);
  }

  /**
   * Pobierz wizyty dla konkretnej daty i lekarza
   */
  getAppointmentsByDateAndDoctor(doctorId: string, date: string): Observable<Appointment[]> {
    const doctorSchedule = this.schedule[doctorId] || {};
    const appointments = doctorSchedule[date] || [];
    return of(appointments);
  }

  /**
   * Dodaj wizytę do harmonogramu
   */
  addAppointment(doctorId: string, date: string, appointment: Appointment): Observable<boolean> {
    if (!this.schedule[doctorId]) {
      this.schedule[doctorId] = {};
    }
    if (!this.schedule[doctorId][date]) {
      this.schedule[doctorId][date] = [];
    }
    this.schedule[doctorId][date].push(appointment);
    return of(true);
  }

  /**
   * Usuń wizytę z harmonogramu
   */
  removeAppointment(doctorId: string, date: string, appointmentId: number): Observable<boolean> {
    if (this.schedule[doctorId] && this.schedule[doctorId][date]) {
      this.schedule[doctorId][date] = this.schedule[doctorId][date].filter(
        (appointment) => appointment.id !== appointmentId
      );
      return of(true);
    }
    return of(false);
  }

  /**
   * Aktualizuj status wizyty
   */
  updateAppointmentStatus(doctorId: string, date: string, appointmentId: number, status: string): Observable<boolean> {
    if (this.schedule[doctorId] && this.schedule[doctorId][date]) {
      const appointment = this.schedule[doctorId][date].find((app) => app.id === appointmentId);
      if (appointment) {
        appointment.status = status;
        return of(true);
      }
    }
    return of(false);
  }

  /**
 * Pobierz cały harmonogram dla danego pacjenta
 */
  getScheduleForPatient(patientId: string): Observable<Appointment[]> {
    const appointments: Appointment[] = [];

    // Iteruj przez wszystkich lekarzy
    Object.values(this.schedule).forEach((doctorSchedule) => {
      // Iteruj przez wszystkie daty w harmonogramie lekarza
      Object.values(doctorSchedule).forEach((dailyAppointments) => {
        // Filtruj wizyty dla danego pacjenta
        dailyAppointments.forEach((appointment) => {
          if (appointment.patient_id === patientId) {
            appointments.push(appointment);
          }
        });
      });
    });

    return of(appointments);
  }
}
