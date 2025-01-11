export interface Absence {
    id?: number;
    date: string; // Data w formacie YYYY-MM-DD
    reason?: string; // Opcjonalny powód nieobecności
    doctor_id: string;
}
  