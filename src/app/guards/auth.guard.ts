import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';
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
      filter((user) => user !== null),
      take(1),
      map((user) => {
        console.log('sprawdzanie użytkownika w AuthGuard:', user);

        const expectedRole = route.data['role'];
        if (user?.role !== expectedRole) {
          console.warn('Niewłaściwa rola użytkownika');
          this.router.navigate(['/']);
          return false;
        }

        return true;
      })
    );
  }
}
