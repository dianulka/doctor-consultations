import { Injectable ,inject} from '@angular/core';
import { Auth, createUserWithEmailAndPassword, SignInMethod, signInWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { update } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { Firestore, doc, setDoc,getDoc } from '@angular/fire/firestore';
import { map } from 'rxjs';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<any | null>(null);

  constructor() {}

  register(email: string, username: string, password: string, firstName: string, lastName: string, age: number, gender: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password)
      .then(response => {
        // Ustawienie nazwy użytkownika w Firebase Authentication
        return updateProfile(response.user, { displayName: username })
          .then(() => {
            // Zapisanie szczegółów użytkownika w Firestore
            const userRef = doc(this.firestore, `users/${response.user.uid}`);
            return setDoc(userRef, {
              id: response.user.uid,
              email,
              username,
              role: 'Patient', // Rejestrujemy pacjenta
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

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.auth, email, password).then((response) => {
      const userRef = doc(this.firestore, `users/${response.user.uid}`);
      return getDoc(userRef).then((doc) => {
        const user = doc.data() as User;
        console.log(user);
        this.currentUserSubject.next(user);
        if (user.role === 'Patient') {
          this.router.navigate(['/patient-dashboard']);
          console.log('patient');
        } else if (user.role === 'Doctor') {
          this.router.navigate(['/doctor-dashboard']);
        } else if (user.role === 'Admin') {
          this.router.navigate(['/admin-panel']);
        }
      });
    });
  
    return from(promise);
  }
  

  logout(): Observable<void> {
    const promise = this.auth.signOut();
    return from(promise);
  }

  

  getCurrentUser(): Observable<any | null> {
    return this.currentUserSubject.asObservable();
  }
  
}
