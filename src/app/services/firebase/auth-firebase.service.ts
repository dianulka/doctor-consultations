import { Injectable ,inject} from '@angular/core';
import { Auth, createUserWithEmailAndPassword, SignInMethod, signInWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { update } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

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

  login(email:string, password:string): Observable<void>{
    
    const promise = signInWithEmailAndPassword(
      this.auth,
      email,
      password).then(()=>{});
    
    
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = this.auth.signOut();
    return from(promise);
  }

  
}
