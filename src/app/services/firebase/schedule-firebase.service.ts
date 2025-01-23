import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, deleteDoc, updateDoc, getDocs, query, where, CollectionReference, onSnapshot } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Appointment } from '../../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleFirebaseService {

  private appointmentsCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.appointmentsCollection = collection(this.firestore, 'appointments');
  }

  /**
   * Pobierz wszystkie wizyty
   */
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

  /**
   * Pobierz wizyty dla konkretnego pacjenta
   */
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

  /**
   * Subskrybuj wizyty w czasie rzeczywistym
   */
  getAppointmentsRealtime(): Observable<Appointment[]> {
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(this.appointmentsCollection, (snapshot) => {
        const appointments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Appointment));
        observer.next(appointments);
      });

      // Zwróć funkcję czyszczącą subskrypcję
      return { unsubscribe };
    });
  }

  /**
   * Pobierz wizyty dla konkretnego lekarza
   */
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

  /**
   * Dodaj nową wizytę
   */
  addAppointment(appointment: Appointment): Observable<void> {
    return from(addDoc(this.appointmentsCollection, appointment)).pipe(
      map(() => {
        console.log('Appointment added successfully.');
      })
    );
  }

  /**
   * Zaktualizuj wizytę
   */
  updateAppointment(appointmentId: string, updatedData: Partial<Appointment>): Observable<void> {
    const appointmentDoc = doc(this.firestore, `appointments/${appointmentId}`);
    return from(updateDoc(appointmentDoc, updatedData)).pipe(
      map(() => {
        console.log('Appointment updated successfully.');
      })
    );
  }

  /**
   * Usuń wizytę
   */
  removeAppointment(appointmentId: string): Observable<boolean> {
    const appointmentDoc = doc(this.firestore, `appointments/${appointmentId}`);
    return from(deleteDoc(appointmentDoc)).pipe(
      map(() => {
        console.log('Appointment removed successfully.');
        return true;
      }),
      // Jeśli usuwanie nie powiedzie się, złap błąd
      map(() => false)
    );
  }

  /**
   * Sprawdź konflikty w wizytach dla konkretnego dnia i przedziału czasowego
   */
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

  /**
   * Konwertuj czas w formacie HH:mm na minuty
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }


  
}
