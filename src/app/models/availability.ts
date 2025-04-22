export interface Availability {
    id?: string;
    type: 'cyclic' | 'one-time'; 
    startDate: string; // Format YYYY-MM-DD
    endDate?: string; // Format YYYY-MM-DD
    daysOfWeek?: string[]; // Maski dni np. ['Mon', 'Tue', 'Thu', 'Sat']
    timeRanges: { start: string; end: string }[]; 
    doctor_id: string; 
}
  


  