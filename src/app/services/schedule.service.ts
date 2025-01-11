import { Injectable } from '@angular/core';
import { Observable,of, Scheduler } from 'rxjs';
import { Schedule,Appointment } from '../models/appointment';
import { HttpClient } from '@angular/common/http';




@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private apiUrl = 'http://localhost:3000';

  private schedule: Schedule = {
    '100': {
      '2025-01-12': [
        {
          id: 1,
          date: '2025-01-12',
          startTime: '09:00',
          endTime: '09:30',
          type: 'Consultation',
          status: 'reserved',
          patient_id: '100',
          doctor_id: '100',
        },
        {
          id: 2,
          date: '2025-01-12',
          startTime: '11:00',
          endTime: '11:30',
          type: 'Checkup',
          status: 'completed',
          patient_id: '100',
          doctor_id: '100',
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
          doctor_id: '100',
        },
      ],
    },
    '101': {
      '2025-01-12': [
        {
          id: 3,
          date: '2025-01-12',
          startTime: '09:00',
          endTime: '09:30',
          type: 'Consultation',
          status: 'reserved',
          patient_id: '101',
          doctor_id: '101',
        },
      ],
    },
  };

  
  //constructor(private http: HttpClient) { }
  constructor() { }

  getAllApointments() : Observable<Appointment[]>{
    //return this.http.get<Appointment[]>(this.apiUrl).flat; 
    const appointments: Appointment[] = Object.values(this.schedule).flat();
    return of(appointments);
    
  }

  // Pobierz wizyty dla konkretnej daty
  getAppointmentsByDate(date: string): Observable<Appointment[]> {
    return of(this.schedule[date] || []);
  }

  // Dodaj wizytę
  addAppointment(date: string, appointment: Appointment): Observable<boolean> {
    if (!this.schedule[date]) {
      this.schedule[date] = [];
    }
    this.schedule[date].push(appointment);
    return of(true); // Symulacja sukcesu
  }

  // Usuń wizytę
  removeAppointment(date: string, appointmentId: number): Observable<boolean> {
    if (this.schedule[date]) {
      this.schedule[date] = this.schedule[date].filter(a => a.id !== appointmentId);
      return of(true); // Symulacja sukcesu
    }
    return of(false); // Nie znaleziono wizyty
  }

  // Pobierz cały harmonogram
  getSchedule(): Observable<Schedule> {
    return of(this.schedule);
  }

  getScheduleForDoctor(doctorId: string): Observable<Schedule[typeof doctorId]> {
    return of(this.schedule[doctorId] || {});
  }
}
