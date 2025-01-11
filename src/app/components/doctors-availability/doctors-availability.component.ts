import { Component, NgModule } from '@angular/core';
import { Availability } from '../../models/availability';
import { AvailabilityService } from '../../services/availability.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';


@Component({
  selector: 'app-doctors-availability',
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ],
  templateUrl: './doctors-availability.component.html',
  styleUrl: './doctors-availability.component.css'
})
export class DoctorsAvailabilityComponent {
  newAvailability: Availability = {
    type: 'cyclic',
    startDate: '',
    endDate: '',
    daysOfWeek: [],
    timeRanges: [],
  };
  allAvailabilities: Availability[] = [];

  constructor(private availabilityService: AvailabilityService) {}

  ngOnInit(): void {
    this.loadAvailabilities();
  }

  // Pobierz dostępności
  loadAvailabilities(): void {
    this.availabilityService.getAvailabilities().subscribe((availabilities) => {
      this.allAvailabilities = availabilities;
    });
  }

  // Dodaj nową dostępność
  addAvailability(): void {
    this.availabilityService.addAvailability(this.newAvailability).subscribe(() => {
      this.loadAvailabilities(); // Odśwież dostępności
      this.resetForm(); // Wyczyść formularz
    });
  }

  // Resetuj formularz
  resetForm(): void {
    this.newAvailability = {
      type: 'cyclic',
      startDate: '',
      endDate: '',
      daysOfWeek: [],
      timeRanges: [],
    };
  }

  // Dodaj przedział czasowy
  addTimeRange(): void {
    this.newAvailability.timeRanges.push({ start: '', end: '' });
  }

  // Usuń przedział czasowy
  removeTimeRange(index: number): void {
    this.newAvailability.timeRanges.splice(index, 1);
  }
  

}
