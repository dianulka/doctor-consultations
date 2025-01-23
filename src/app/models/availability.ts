export interface Availability {
    id?: string;
    type: 'cyclic' | 'one-time'; // Typ dostępności
    startDate: string; // Format YYYY-MM-DD
    endDate?: string; // Format YYYY-MM-DD (dla cyklicznej dostępności)
    daysOfWeek?: string[]; // Maski dni np. ['Mon', 'Tue', 'Thu', 'Sat']
    timeRanges: { start: string; end: string }[]; // Przedziały czasowe
    doctor_id: string; // ID lekarza
}
  


  