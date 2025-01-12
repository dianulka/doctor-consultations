import { Availability } from "./availability";


export interface User {
    id: string; // Unikalny identyfikator użytkownika
    username: string; // Nazwa użytkownika/login
    email: string; // Email użytkownika
    role: 'Guest' | 'Patient' | 'Doctor' | 'Admin'; // Rola użytkownika
    profile: PatientProfile | DoctorProfile | AdminProfile | null; // Szczegóły profilu specyficzne dla roli
  }

export interface PatientProfile {
    firstName: string; // Imię
    lastName: string; // Nazwisko
    age: number; // Wiek
    gender: 'Male' | 'Female' | 'Other'; // Płeć
    medicalHistory?: string[]; // Historia medyczna (opcjonalna)
  }

export interface DoctorProfile {
    firstName: string; // Imię
    lastName: string; // Nazwisko
    specialization: string; // Specjalizacja (np. Kardiolog, Dermatolog)
    
  }

export interface AdminProfile {
    firstName: string; // Imię
    lastName: string; // Nazwisko
}
  