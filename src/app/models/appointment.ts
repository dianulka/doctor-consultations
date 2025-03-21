export interface Appointment {
    id?: string; // Unikalny identyfikator wizyty
    date: string,
    startTime: string; // Czas rozpoczęcia (w formacie HH:mm)
    endTime: string; // Czas zakończenia (w formacie HH:mm)
    type: string; // Typ wizyty, np. "Consultation"
    status: string; // Status wizyty, np. "reserved" lub "completed"
    patient_id: string; // ID pacjenta
    doctor_id: string; // ID lekarza
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