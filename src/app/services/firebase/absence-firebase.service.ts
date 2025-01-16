import { Injectable } from '@angular/core';
import { Firestore ,addDoc,collection,collectionData} from '@angular/fire/firestore';
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


}
