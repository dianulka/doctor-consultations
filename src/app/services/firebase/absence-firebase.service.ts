import { Injectable } from '@angular/core';
import { Firestore ,addDoc,collection,collectionData, onSnapshot,where,query} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable ,from} from 'rxjs';
import { Absence } from '../../models/absence';


@Injectable({
  providedIn: 'root'
})
export class AbsenceFirebaseService {

  constructor() { }
  firestore = inject(Firestore)

  absenceCollection = collection(this.firestore, 'absences');

  getAbsences():Observable<Absence[]>{
    return collectionData(this.absenceCollection, {
      idField: 'id',
    }) as Observable<Absence[]>
  }

  // firebase return the id of inserted object
  addAbsence(absence: Absence) : Observable<string>{
    const promise = addDoc(this.absenceCollection, absence)
                    .then(response => response.id);

    return from(promise);
  }

  getAbsencesRealtime(): Observable<Absence[]> {
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(this.absenceCollection, (snapshot) => {
        const absences = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        } as Absence));

        observer.next(absences);
      });

      return { unsubscribe };
    });
  }

  getAbsencesRealTimeForDoctor(doctorId:string):Observable<Absence[]>{
    const q = query(this.absenceCollection, where('doctor_id', '==', doctorId));
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const absences = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        } as Absence));

        observer.next(absences);
      });

      return { unsubscribe };
    });
  }


}
