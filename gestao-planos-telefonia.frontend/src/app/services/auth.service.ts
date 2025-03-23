import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CredentialResponse } from 'google-one-tap';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private googleClientId = environment.googleClientId;
  private apiRoot = environment.apiRoot + '/Auth';
  private apiService = inject(ApiService);
  private router = inject(Router);

  initializeGoogleAuth() {
    google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: (response: any) => this.handleCredentialResponse(response),
      auto_select: false,
      cancel_on_tap_outside: true
    });

    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      {
        theme: 'outline',
        size: 'medium',
        width: '100%',
        text: "signin"
      }
    );
  }

  handleCredentialResponse(response: CredentialResponse) {
    console.log(response.credential);
    
  }
}