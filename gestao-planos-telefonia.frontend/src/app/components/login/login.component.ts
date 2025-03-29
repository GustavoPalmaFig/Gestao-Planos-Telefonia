import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ApiService } from '../../services/api.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { ResponsiveService } from '../../services/responsive.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-login',
  imports: [
    CardModule,
    InputTextModule,
    PasswordModule,
    DividerModule,
    CommonModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TooltipModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AuthService, ApiService]
})
export class LoginComponent {
  protected isCreatingAccount = signal<boolean>(false);
  private strongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  protected authService = inject(AuthService);
  private fb = inject(FormBuilder);
  protected responsiveService = inject(ResponsiveService);
  protected loadingService = inject(LoadingService);

  protected userForm: FormGroup = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    passwordHash: ['']
  });

  constructor() {
    effect(() => {
      this.updateValidators();
    });
  }

  ngAfterViewInit(): void {
    this.authService.initializeGoogleAuth();
  }

  get nameFormField() {
    return this.userForm.get('name');
  }

  get emailFormField() {
    return this.userForm.get('email');
  }

  get passwordFormField() {
    return this.userForm.get('passwordHash');
  }

  toggleAccountCreation(): void {
    this.isCreatingAccount.set(!this.isCreatingAccount());
  }

  updateValidators(): void {
    if (this.isCreatingAccount()) {
      this.userForm.get('name')?.setValidators([Validators.required]);
      this.userForm.get('passwordHash')?.setValidators([Validators.required, Validators.pattern(this.strongPasswordRegx)]);
    } else {
      this.userForm.get('name')?.clearValidators();
      this.userForm.get('passwordHash')?.setValidators([Validators.required]);
    }
    this.userForm.get('name')?.updateValueAndValidity();
    this.userForm.get('passwordHash')?.updateValueAndValidity();
  }

  createUser(): void {
    if (this.userForm.valid) {
      this.loadingService.setLoading(true);
      this.authService.createUser(this.userForm.value).add(() => this.loadingService.setLoading(false));
    }
  }

  login(): void {
    if (this.userForm.valid) {
      this.loadingService.setLoading(true);
      this.authService.login(this.userForm.value).add(() => this.loadingService.setLoading(false));
    }
  }

  loginAsGuest(): void {
    this.authService.loginAsGuest().add(() => this.loadingService.setLoading(false));
  }
}
