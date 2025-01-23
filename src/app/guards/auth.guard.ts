import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthFirebaseService } from '../services/firebase/auth-firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthFirebaseService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      take(1), // Pobieramy tylko jedną wartość (pojedyncza subskrypcja)
      map((user) => {
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }

        const expectedRole = route.data['role'];
        if (user.role !== expectedRole) {
          this.router.navigate(['/not-authorized']);
          return false;
        }

        return true;
      })
    );
  }
}
