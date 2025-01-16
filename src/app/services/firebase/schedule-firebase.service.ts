import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection,collectionData,addDoc } from '@angular/fire/firestore';
import { Observable ,from,map} from 'rxjs';
import { Availability } from '../../models/availability';
import { Schedule,DailySchedule, Appointment} from '../../models/appointment';
@Injectable({
  providedIn: 'root'
})
export class ScheduleFirebaseService {

  constructor() { }
  firestore = inject(Firestore)
  
  scheduleCollection = collection(this.firestore, 'schedule');


  getScheduleForDoctor(doctorId: string): Observable<DailySchedule> {
    console.log('Fetching schedule for doctor from Firestore');
    const doctorScheduleCollection = collection(this.scheduleCollection, doctorId);
    return collectionData(doctorScheduleCollection, { idField: 'id' }).pipe(
      map((appointments: any[]) => {
        const dailySchedule: DailySchedule = {};
        appointments.forEach((appointment: Appointment) => {
          if (!dailySchedule[appointment.date]) {
            dailySchedule[appointment.date] = [];
          }
          dailySchedule[appointment.date].push(appointment);
        });
        return dailySchedule;
      })
    ) as Observable<DailySchedule>;
  }

  
}
