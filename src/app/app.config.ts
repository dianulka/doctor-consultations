import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BaseCalendarComponent } from './components/base-calendar/base-calendar.component';
import { Firestore } from '@angular/fire/firestore/lite';
import { provideHttpClient } from '@angular/common/http';
import { getAuth, provideAuth } from '@angular/fire/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCi9X7gBea8jNoQIJqDjGKGuShrNTTJlSM",
  authDomain: "doctor-consultations-app.firebaseapp.com",
  projectId: "doctor-consultations-app",
  storageBucket: "doctor-consultations-app.firebasestorage.app",
  messagingSenderId: "984480741013",
  appId: "1:984480741013:web:07de194a26005871698d9c"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideHttpClient(),
    provideAuth(()=>getAuth())
  
  ]
};


