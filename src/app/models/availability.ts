export interface Availability {
    id?: number;
    type: 'cyclic' | 'one-time'; // Typ dostępności
    startDate: string; // Format YYYY-MM-DD
    endDate?: string; // Format YYYY-MM-DD (dla cyklicznej dostępności)
    daysOfWeek?: string[]; // Maski dni np. ['Mon', 'Tue', 'Thu', 'Sat']
    timeRanges: { start: string; end: string }[]; // Przedziały czasowe
}
  