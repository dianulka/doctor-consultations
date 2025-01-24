import { Component, NgModule } from '@angular/core';
import { Availability } from '../../models/availability';
//import { AvailabilityService } from '../../services/availability.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { AvailabilityService } from '../../services/availability.service';

import { AvailabilityFirebaseService } from '../../services/firebase/availability-firebase.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-doctors-availability',
  standalone: true,
  imports: [
    CommonModule, FormsModule,RouterModule
  ],
  templateUrl: './doctors-availability.component.html',
  styleUrl: './doctors-availability.component.css'
})
export class DoctorsAvailabilityComponent {
  currentView: 'cyclic' | 'one-time' = 'cyclic';

  doctorId:string = '';
  newAvailability: Availability = {
    type: this.currentView,
    startDate: '',
    endDate: '',
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    timeRanges: [],
    doctor_id: this.doctorId
  };
  allAvailabilities: Availability[] = [];
  availableTimes: string[] = []; 

  

  // constructor(private availabilityService: AvailabilityService) {}
  constructor(private availabilityService: AvailabilityFirebaseService,private route: ActivatedRoute) {}

 
  
  ngOnInit(): void {
    this.generateAvailableTimes();
    this.route.queryParams.subscribe((params) => {
      this.doctorId = params['doctor_id']; // Pobieranie doctorId z queryParams
      if (this.doctorId) {
        //this.loadAvailabilities();
        //this.loadAbsences();
        //this.loadAppointments();
        console.log('DoctorID availability' + this.doctorId);
        this.loadAvailabilities();
        this.newAvailability.doctor_id = this.doctorId;

      } else {
        console.error('doctorId is missing in queryParams');
      }
    });
    
  }

  loadAvailabilities(): void {
    this.availabilityService.getAvailabilities().subscribe((availabilities) => {
      this.allAvailabilities = availabilities;
    });
  }

  addAvailability(): void {

    if (!this.newAvailability.timeRanges || this.newAvailability.timeRanges.length === 0) {
      this.newAvailability.timeRanges = this.generateDefaultTimeRanges(); 
    }
  
    this.availabilityService.addAvailability(this.newAvailability).subscribe(() => {
      this.loadAvailabilities();
      this.resetForm(); 
    });
  }
  
  

  resetForm(): void {
    this.newAvailability = {
      type: this.currentView,
      startDate: '',
      endDate: '',
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      timeRanges: [],
      doctor_id: this.doctorId
    };
  }

  addTimeRange(): void {
    this.newAvailability.timeRanges.push({ start: '', end: '' });
  }

  removeTimeRange(index: number): void {
    this.newAvailability.timeRanges.splice(index, 1);
  }

  generateDefaultTimeRanges(): { start: string; end: string }[] {
    return [{ start: '08:00', end: '14:00' }];
  }

  toggleDaySelection(day: string): void {
    if (!this.newAvailability.daysOfWeek) {
      this.newAvailability.daysOfWeek = []; 
    }
  
    const index = this.newAvailability.daysOfWeek.indexOf(day);
    if (index > -1) {
      this.newAvailability.daysOfWeek.splice(index, 1);
    } else {
      this.newAvailability.daysOfWeek.push(day);
    }
  }
  

  generateAvailableTimes(): void {
    const startHour = 8;
    const endHour = 14;
    const stepMinutes = 30;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += stepMinutes) {
        if (hour === endHour && minutes > 0) break; // Koniec przedziału na 14:30
        const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        this.availableTimes.push(time);
      }
    }
  }
}