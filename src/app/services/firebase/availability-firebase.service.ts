import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection,collectionData,addDoc } from '@angular/fire/firestore';
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
}
