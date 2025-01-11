import { Component } from '@angular/core';
import { Absence } from '../../models/absence';
import { AbsenceService } from '../../services/absence.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-doctors-absence',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors-absence.component.html',
  styleUrl: './doctors-absence.component.css'
})
export class DoctorsAbsenceComponent {
  
  newAbsence: Absence = { date: '', reason: '', doctor_id: '0' }; // Nowa nieobecność
  absences: Absence[] = []; // Lista nieobecności

  constructor(private absenceService: AbsenceService) {}

  ngOnInit(): void {
    this.loadAbsences();
  }

  // Pobierz nieobecności
  loadAbsences(): void {
    this.absenceService.getAbsences().subscribe((absences) => {
      this.absences = absences;
    });
  }

  // Dodaj nieobecność
  addAbsence(): void {
    if (this.newAbsence.date) {
      this.absenceService.addAbsence(this.newAbsence).subscribe(() => {
        this.loadAbsences(); // Odśwież listę nieobecności
        this.newAbsence = { date: '', reason: '',doctor_id: '0' }; // Resetuj formularz
      });
    }
  }
}
