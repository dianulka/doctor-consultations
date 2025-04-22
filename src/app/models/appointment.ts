export interface Appointment {
    id?: string;
    date: string,
    startTime: string; 
    endTime: string;
    type: string; 
    status: string; 
    patient_id: string; 
    doctor_id: string; 
    notes?: string;
    patient_age?: number;
    patient_gender?: string;
    patient_name?:string;
}

// export interface DailySchedule {
//     [date: string]: Appointment[]; // Klucz: data (YYYY-MM-DD), Wartość: lista wizyt
// }
  
//   // Harmonogram dla wszystkich lekarzy
// export interface Schedule {
//     [doctorId: string]: DailySchedule; // Klucz: ID lekarza, Wartość: DailySchedule
// }