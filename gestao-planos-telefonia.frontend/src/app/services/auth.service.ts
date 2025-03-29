import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http'; 
import { User } from '../models/user'; 
import { MessageService } from 'primeng/api';
declare const google: any;
import { CredentialResponse } from 'google-one-tap';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private googleClientId = environment.googleClientId;
  private apiRoot = environment.apiRoot + '/Auth';
  public isAuthenticated = signal<boolean>(false);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  checkAuthenticated() {
    const token = sessionStorage.getItem('access_token');
    this.isAuthenticated.set(!!token);
  }

  initializeGoogleAuth() {
    google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: (response: any) => this.handleGoogleCredentialResponse(response),
      auto_select: false,
      cancel_on_tap_outside: true,
      ux_mode: "popup"
    })

    google.accounts.id.renderButton(
      document.getElementById("google-sign"),
      {
        theme: "outline",
        type: "icon", 
        size: "large", 
        shape: "pill", 
     }
    );

    // google.accounts.id.prompt();
  }

  handleGoogleCredentialResponse(response: CredentialResponse) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.apiService.post(`${this.apiRoot}/GoogleLogin`, JSON.stringify(response.credential), headers).subscribe((token: any) => {
      sessionStorage.setItem('access_token', token.jwtToken);
      this.router.navigate(['']);
    });
  }

  createUser(user: User) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.apiService.post(`${this.apiRoot}/CreateUser`, user, headers).subscribe((response: any) => {
      sessionStorage.setItem('access_token', response.token);
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário Cadastrado', life: 3000 });
      this.router.navigate(['']);
    });
  }

  login(user: User) {
    const loginRequest = {
      email: user.email,
      password: user.passwordHash
    };
    return this.apiService.post(`${this.apiRoot}/Login`, loginRequest).subscribe((response: any) => {
      sessionStorage.setItem('access_token', response.token);
      this.router.navigate(['']);
    });
  }

  loginAsGuest() {
    return this.apiService.post(`${this.apiRoot}/GuestLogin`, null).subscribe((response: any) => {
      sessionStorage.setItem('access_token', response.token);
      this.router.navigate(['']);
    });
  }

  logout() {
    sessionStorage.removeItem('access_token');
    this.isAuthenticated.set(false);
    this.router.navigate(['login']);
  }
}