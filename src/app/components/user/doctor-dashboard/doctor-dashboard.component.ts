import { Component } from '@angular/core';
import { User
 } from '../../../models/user';
 //import { UserService } from '../../../services/firebase/user.service';
@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent {
  user: User | null = null;

  // constructor(private userService: UserService) {}

  // ngOnInit(): void {
  //   this.userService.getUser().subscribe((user) => {
  //     this.user = user;
  //   });
  // }
}
