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
  private jsonHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  public isAuthenticated = signal<boolean>(false);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  setAuthentication() {
    const user = sessionStorage.getItem('user');
    
    if (!user) {
      this.isAuthenticated.set(false);
      return;
    }

    const userData = JSON.parse(user);
    const expirationDate = new Date(userData.exp * 1000);
    const isAuthenticated = new Date() < expirationDate;
    this.isAuthenticated.set(isAuthenticated);
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
    this.apiService.post(`${this.apiRoot}/GoogleLogin`, JSON.stringify(response.credential), this.jsonHeaders).subscribe((token: any) => {
      this.handleAccessToken(token.jwtToken);
    });
  }

  createUser(user: User) {
    return this.apiService.post(`${this.apiRoot}/CreateUser`, user, this.jsonHeaders).subscribe((response: any) => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário Cadastrado', life: 3000 });
      this.handleAccessToken(response.token);
    });
  }

  login(user: User) {
    const loginRequest = {
      email: user.email,
      password: user.passwordHash
    };
    return this.apiService.post(`${this.apiRoot}/Login`, loginRequest).subscribe((response: any) => {
      this.handleAccessToken(response.token);
    });
  }

  loginAsGuest() {
    return this.apiService.post(`${this.apiRoot}/GuestLogin`, null).subscribe((response: any) => {
      this.handleAccessToken(response.token);
    });
  }

  handleAccessToken(token: string) {
    const decodedPayload = this.decodeToken(token);
    if (decodedPayload) {
      this.storeUser(decodedPayload);
      this.router.navigate(['']);
    } else {
      console.error('Token inválido. Não foi possível processar o acesso.');
    }
  }

  decodeToken(token: string) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }

  storeUser(payload: string) {
    const user = payload;
    sessionStorage.setItem('user', user);
  }

  logout() {
    sessionStorage.removeItem('user');
    this.isAuthenticated.set(false);
    this.router.navigate(['login']);
  }
}