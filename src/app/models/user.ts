
export interface User {
    id: string;
    username: string; 
    email: string; 
    role: 'Patient' | 'Doctor' | 'Admin'; 
    profile: PatientProfile | DoctorProfile | AdminProfile | null; 
    
  }

export interface PatientProfile {
    firstName: string; 
    lastName: string; 
    age: number; 
    gender: 'Male' | 'Female' | 'Other'; 
    
}

export interface DoctorProfile {
    firstName: string; 
    lastName: string; 
    specialization: string;
    
  }

export interface AdminProfile {
    firstName: string; 
    lastName: string;
}
  