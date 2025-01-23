export interface Absence {
    id?: string; // Zmieniono z `number` na `string`
    date: string; // Data w formacie YYYY-MM-DD
    reason?: string; // Opcjonalny powód nieobecności
    doctor_id: string;
  }
  