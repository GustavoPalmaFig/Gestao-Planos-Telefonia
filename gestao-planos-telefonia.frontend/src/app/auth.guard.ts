import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.authService.checkAuthenticated();
    const isAuthenticated = this.authService.isAuthenticated();

    if (isAuthenticated && state.url === '/login') {
      this.router.navigate(['']);
      return false;
    }
  
    if (!isAuthenticated && state.url !== '/login') {
      this.router.navigate(['login']);
      return false;
    }
  
    return true;
  }
}