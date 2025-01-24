import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, deleteDoc, updateDoc, getDocs, query, where, CollectionReference, onSnapshot } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Appointment } from '../../models/appointment';
import { concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleFirebaseService {

  private appointmentsCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.appointmentsCollection = collection(this.firestore, 'appointments');
  }


  getAllAppointments(): Observable<Appointment[]> {
    return from(getDocs(this.appointmentsCollection)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Appointment))
      )
    );
  }

  getAppointmentsForPatient(patientId: string): Observable<Appointment[]> {
    const q = query(this.appointmentsCollection, where('patient_id', '==', patientId));
    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Appointment))
      )
    );
  }

  
  getAppointmentsRealtime(): Observable<Appointment[]> {
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(this.appointmentsCollection, (snapshot) => {
        const appointments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Appointment));
        observer.next(appointments);
      });

      return { unsubscribe };
    });
  }


getAppointmentsRealtimeForDoctor(doctorId: string): Observable<Appointment[]> {
  return new Observable((observer) => {
    const q = query(this.appointmentsCollection, where('doctor_id', '==', doctorId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appointments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Appointment));
      observer.next(appointments);
    });

    return { unsubscribe };
  });
}


  getAppointmentsForDoctor(doctorId: string): Observable<Appointment[]> {
    const q = query(this.appointmentsCollection, where('doctor_id', '==', doctorId));
    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Appointment))
      )
    );
  }


  addAppointment(appointment: Appointment): Observable<void> {
    return from(addDoc(this.appointmentsCollection, appointment)).pipe(
      concatMap(() => {
        console.log('Appointment added successfully.');
        return of(void 0);
      })
    );
  }

  updateAppointment(appointmentId: string, updatedData: Partial<Appointment>): Observable<void> {
    const appointmentDoc = doc(this.firestore, `appointments/${appointmentId}`);
    return from(updateDoc(appointmentDoc, updatedData)).pipe(
      map(() => {
        console.log(appointmentDoc);
        console.log('Appointment updated successfully.');
      })
    );
  }


  removeAppointment(appointmentId: string): Observable<boolean> {
    const appointmentDoc = doc(this.firestore, `appointments/${appointmentId}`);
    return from(deleteDoc(appointmentDoc)).pipe(
      map(() => {
        console.log(`Appointment ${appointmentId} removed successfully.`);
        return true;
      }),
      map(() => false)
    );
  }
  

  checkConflicts(date: string, startTime: string, endTime: string, doctorId: string): Observable<boolean> {
    const q = query(
      this.appointmentsCollection,
      where('date', '==', date),
      where('doctor_id', '==', doctorId)
    );

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        const appointments = snapshot.docs.map((doc) => doc.data() as Appointment);
        const startMinutes = this.timeToMinutes(startTime);
        const endMinutes = this.timeToMinutes(endTime);

        return appointments.some((appointment) => {
          const appointmentStart = this.timeToMinutes(appointment.startTime);
          const appointmentEnd = this.timeToMinutes(appointment.endTime);

          return startMinutes < appointmentEnd && endMinutes > appointmentStart;
        });
      })
    );
  }

  
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }


  
}