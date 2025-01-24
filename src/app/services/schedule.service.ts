import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Appointment } from '../models/appointment';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private appointments: Appointment[] = [
    {
    //id: '1',
      date: '2025-01-14',
      startTime: '08:00',
      endTime: '09:30',
      type: 'Consultation',
      status: 'reserved',
      patient_id: '100',
      doctor_id: '0',
      patient_name: 'John Doe',
      patient_age: 30,
      patient_gender: 'Male',
    },
    {
   //  id: '2',
      date: '2025-01-14',
      startTime: '10:00',
      endTime: '10:30',
      type: 'Consultation',
      status: 'reserved',
      patient_id: '101',
      doctor_id: '1',
      patient_name: 'Jane Smith',
      patient_age: 25,
      patient_gender: 'Female',
    },
  ];

  constructor() {}

 
  getAllAppointments(): Observable<Appointment[]> {
    return of(this.appointments);
  }

  
  getAppointmentsForDoctor(doctorId: string): Observable<Appointment[]> {
    const filteredAppointments = this.appointments.filter(
      (appointment) => appointment.doctor_id === doctorId
    );
    return of(filteredAppointments);
  }

 
  getAppointmentsForPatient(patientId: string): Observable<Appointment[]> {
    const filteredAppointments = this.appointments.filter(
      (appointment) => appointment.patient_id === patientId
    );
    return of(filteredAppointments);
  }


  addAppointment(appointment: Appointment): Observable<boolean> {
    appointment.id = this.generateAppointmentId();
    this.appointments.push(appointment);
    return of(true);
  }

  
  removeAppointment(appointmentId: string): Observable<boolean> {
    const initialLength = this.appointments.length;
    this.appointments = this.appointments.filter(
      (appointment) => appointment.id !== appointmentId
    );
    return of(this.appointments.length < initialLength);
  }

  
  updateAppointmentStatus(appointmentId: string, status: string): Observable<boolean> {
    const appointment = this.appointments.find((app) => app.id === appointmentId);
    if (appointment) {
      appointment.status = status;
      return of(true);
    }
    return of(false);
  }

 
  getAppointmentsByDate(date: string): Observable<Appointment[]> {
    const filteredAppointments = this.appointments.filter(
      (appointment) => appointment.date === date
    );
    return of(filteredAppointments);
  }


  private generateAppointmentId(): string {
    return uuidv4(); 
  }
}
