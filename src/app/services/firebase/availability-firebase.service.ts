import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection,collectionData,addDoc,onSnapshot,where,query } from '@angular/fire/firestore';
import { Observable ,from} from 'rxjs';
import { Availability } from '../../models/availability';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityFirebaseService {

  constructor() { }
  firestore = inject(Firestore)
  
  availabilityCollection = collection(this.firestore, 'availability');

  getAvailabilities() : Observable<Availability[]>{
    console.log('Availability firestore');
    return collectionData(this.availabilityCollection, {
          idField: 'id',
        }) as Observable<Availability[]>
  }

  // firebase return the id of inserted object
    addAvailability(availability: Availability) : Observable<string>{
      const promise = addDoc(this.availabilityCollection, availability)
                      .then(response => response.id);
  
      return from(promise);
    }

    getAvailabilitiesRealtime(): Observable<Availability[]> {
      return new Observable((observer) => {
        const unsubscribe = onSnapshot(this.availabilityCollection, (snapshot) => {
          const availabilities = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          } as Availability));
  
          observer.next(availabilities);
        });
  
        return { unsubscribe };
      });
    }

    getAvailabilitiesRealtimeForDoctor(doctorId: string) : Observable<Availability[]> {
      const q = query(this.availabilityCollection, where('doctor_id', '==', doctorId));

      return new Observable((observer) => {
            const unsubscribe = onSnapshot(q, (snapshot) => {
              const absences = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
              } as Availability));
      
              observer.next(absences);
            });
      
            return { unsubscribe };
          });
    }
}
