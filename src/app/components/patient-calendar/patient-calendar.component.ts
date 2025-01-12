import { Component } from '@angular/core';
import { BaseCalendarComponent } from '../base-calendar/base-calendar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-calendar',
  standalone: true,
  imports: [CommonModule, BaseCalendarComponent],
  templateUrl: './patient-calendar.component.html',
  styleUrl: './patient-calendar.component.css'
})
export class PatientCalendarComponent extends BaseCalendarComponent {
  reserveView: boolean = false;

  reserveAConsultation() {
    
    this.reserveView = !this.reserveView;
    console.log('reserveView:' + this.reserveView);
  }


}
