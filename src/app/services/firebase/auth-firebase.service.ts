import { Injectable ,inject} from '@angular/core';
import { Auth, createUserWithEmailAndPassword, SignInMethod, signInWithEmailAndPassword, updateProfile,onAuthStateChanged } from '@angular/fire/auth';
import { update } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { Firestore, doc, setDoc,getDoc, getDocs } from '@angular/fire/firestore';
import { map } from 'rxjs';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {  collection,collectionData,addDoc,onSnapshot,where,query } from '@angular/fire/firestore';
import { browserLocalPersistence,browserSessionPersistence, setPersistence, inMemoryPersistence } from 'firebase/auth';



@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<any | null>(null);

  constructor() {
    this.initializeCurrentUser();
  }

  setPersistenceType(type: 'LOCAL' | 'SESSION' | 'NONE'): Promise<void> {
    let persistence;
    if (type === 'LOCAL') {
      persistence = browserLocalPersistence; 
    } else if (type === 'SESSION') {
      persistence = browserSessionPersistence;
    } else if (type === 'NONE') {
      persistence = inMemoryPersistence; 
    } else {
      throw new Error('Invalid persistence type');
    }

    return setPersistence(this.auth, persistence).then(() => {
      console.log(`Persistence set to: ${type}`);
    }).catch((error) => {
      console.error('Error setting persistence:', error);
      throw error;
    });
  }

  register(email: string, username: string, password: string, firstName: string, lastName: string, age: number, gender: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password)
      .then(response => {
        return updateProfile(response.user, { displayName: username })
          .then(() => {
            const userRef = doc(this.firestore, `users/${response.user.uid}`);
            return setDoc(userRef, {
              id: response.user.uid,
              email,
              username,
              role: 'Patient',
              profile: {
                firstName,
                lastName,
                age,
                gender,
              },
            
            });
          });
      });

    return from(promise);
  }

  registerDoctor(email:string, username: string, password: string,firstName: string, lastName: string, specialization:string) : Observable<void>{

    const promise = createUserWithEmailAndPassword(this.auth, email, password)
    .then(response => {
      return updateProfile(response.user, { displayName: username })
        .then(() => {
          const userRef = doc(this.firestore, `users/${response.user.uid}`);
          return setDoc(userRef, {
            id: response.user.uid,
            email,
            username,
            role: 'Doctor',
            profile: {
              firstName,
              lastName,
              specialization
            },
          
          });
        });
    });

  return from(promise);

}



  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.auth, email, password).then((response) => {
      const userRef = doc(this.firestore, `users/${response.user.uid}`);
      return getDoc(userRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const user = docSnapshot.data() as User;
          this.currentUserSubject.next(user); 
          console.log('Zalogowano użytkownika:', user);
  
          if (user.role === 'Patient') {
            this.router.navigate(['/patient-dashboard']);
          } else if (user.role === 'Doctor') {
            this.router.navigate(['/doctor-dashboard']);
          } else if (user.role === 'Admin') {
            this.router.navigate(['/admin-panel']);
          }
        } else {
          console.error('Brak danych użytkownika w Firestore');
          this.router.navigate(['/']);
        }
      });
    });
  
    return from(promise);
  }

  private initializeCurrentUser(): void {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(this.firestore, `users/${firebaseUser.uid}`);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data() as User;
          this.currentUserSubject.next(userData);
          console.log('Użytkownik załadowany:', userData);
        } else {
          this.currentUserSubject.next(null);
          console.warn('Nie znaleziono danych użytkownika w Firestore.');
        }
      } else {
        this.currentUserSubject.next(null);
        console.warn('Użytkownik niezalogowany.');
      }
    });
  }
  

  logout(): Observable<void> {
    const promise = this.auth.signOut();
    return from(promise);
  }

  

  getCurrentUser(): Observable<any | null> {
    return this.currentUserSubject.asObservable();
  }

  getDoctors(): Observable<User[]> {
    const doctorsRef = collection(this.firestore, 'users');
    const q = query(doctorsRef, where('role', '==', 'Doctor'));
    const promise = getDocs(q).then((querySnapshot) => {
      return querySnapshot.docs.map((doc) => doc.data() as User);
    });
    return from(promise);
  }
  
}
