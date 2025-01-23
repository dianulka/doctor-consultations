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
      take(1),
      map((user) => {
        console.log('Sprawdzanie użytkownika w AuthGuard:', user);

        if (!user) {
          console.warn('Brak zalogowanego użytkownika, przekierowanie na /login');
          this.router.navigate(['/login']);
          return false;
        }

        const expectedRole = route.data['role'];
        if (user.role !== expectedRole) {
          console.warn('Niewłaściwa rola użytkownika, przekierowanie na /not-authorized');
          this.router.navigate(['/not-authorized']);
          return false;
        }

        return true;
      })
    );
  }
}
