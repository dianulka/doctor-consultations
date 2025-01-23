import { Component } from '@angular/core';
import { User } from '../../../models/user';
//import { UserService } from '../../../services/firebase/user.service';
@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent {
  user: User | null = null;

  // /constructor(private userService: UserService) {}

  // ngOnInit(): void {
  //   this.userService.getUser().subscribe((user) => {
  //     this.user = user;
  //   });
  // }
}
