import { Component, inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private authService = inject(AuthService);
  private ngZone = inject(NgZone);

  ngOnInit(): void {
    this.authService.initializeGoogleAuth();
  }
}
