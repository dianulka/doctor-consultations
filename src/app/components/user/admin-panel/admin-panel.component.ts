import { Component } from '@angular/core';
import {User, AdminProfile } from '../../../models/user';
import { AuthFirebaseService } from '../../../services/firebase/auth-firebase.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {
  adminData: User | null = null;
  adminProfile: AdminProfile | null = null;

   constructor(
      private authService: AuthFirebaseService,
      private router: Router
    ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user?.role === 'Admin') {
        this.adminData = user;
        this.adminProfile = user.profile as AdminProfile;

      } else {
        this.router.navigate(['/not-authorized']);
      }
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  setPersistence(type: 'LOCAL' | 'SESSION' | 'NONE') {
    this.authService.setPersistenceType(type);
  }

}
