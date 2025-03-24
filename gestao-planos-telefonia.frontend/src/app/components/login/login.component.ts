import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {
  protected isCreatingAccount = false;
  protected submitted = false;
  private strongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  public userForm: FormGroup = this.fb.group({
    name: ['', this.isCreatingAccount ? Validators.required : null],
    email: ['', [Validators.required, Validators.email]],
    passwordHash: ['', [Validators.required, Validators.pattern(this.strongPasswordRegx)]]
  });

  ngAfterViewInit(): void {
    this.authService.initializeGoogleAuth();
  }

  get passwordFormField() {
    return this.userForm.get('passwordHash');
  }

  createUser(): void {
    this.submitted = true;
    if (this.userForm.valid) {
      this.authService.createUser(this.userForm.value);
    }
  }

  login(): void {
    this.submitted = true;
    if (this.userForm.valid) {
      this.authService.login(this.userForm.value);
    }
  }

  loginAsGuest(): void {
    this.authService.loginAsGuest();
  }
}
