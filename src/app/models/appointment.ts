export interface Appointment {
    id: number; // Unikalny identyfikator wizyty
    date: string,
    startTime: string; // Czas rozpoczęcia (w formacie HH:mm)
    endTime: string; // Czas zakończenia (w formacie HH:mm)
    type: string; // Typ wizyty, np. "Consultation"
    status: string; // Status wizyty, np. "reserved" lub "completed"
    patient_id: string; // ID pacjenta
    doctor_id: string; // ID lekarza
}

export interface Schedule {
    [date: string]: Appointment[]; // Klucz: data, Wartość: tablica wizyt
}
  