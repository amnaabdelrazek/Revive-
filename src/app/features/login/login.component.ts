import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  showPassword = false;
  isSubmitting = false;
  serverError: string | null = null;
  selectedCountryDialCode = '+20';

   countries = [
    { flag: '🇪🇬', name: 'مصر', dialCode: '+20' },
    { flag: '🇸🇦', name: 'السعودية', dialCode: '+966' },
    { flag: '🇦🇪', name: 'الإمارات', dialCode: '+971' },
    { flag: '🇯🇴', name: 'الأردن', dialCode: '+962' },
    { flag: '🇶🇦', name: 'قطر', dialCode: '+974' },
    { flag: '🇰🇼', name: 'الكويت', dialCode: '+965' },
  ];
  
  readonly loginForm = this.fb.nonNullable.group({
    mobile_number: ['', [Validators.required, Validators.pattern(/^\d{6,15}$/)]],
    password: ['', Validators.required],
  });

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onCountryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCountryDialCode = target.value;
  }

  private normalizeMobileNumber(value: string): string {
    const digits = value.replace(/\D/g, '');
    return digits ? `${this.selectedCountryDialCode}${digits}` : '';
  }

  getFieldError(controlName: 'mobile_number' | 'password'): string | null {
    const control = this.loginForm.get(controlName);

    if (!control || !control.touched || !control.invalid) {
      return null;
    }

    if (control.hasError('required')) {
      return controlName === 'mobile_number' ? 'رقم الواتساب مطلوب' : 'كلمة المرور مطلوبة';
    }

    if (controlName === 'mobile_number' && control.hasError('pattern')) {
      return 'أدخل رقم واتساب صحيح ';
    }

    return null;
  }

  getFormErrorMessage(): string | null {
    if (this.serverError) {
      return this.serverError;
    }

    return this.loginForm.errors?.['invalidCredentials']
      ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
      : null;
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.serverError = null;

    const { mobile_number, password } = this.loginForm.getRawValue();

    this.authService.login({ mobile_number: this.normalizeMobileNumber(mobile_number), password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/user-profile']);
      },
      error: () => {
        this.loginForm.setErrors({ invalidCredentials: true });
        this.serverError = 'رقم الواتساب أو كلمة المرور غير صحيحة.';
        this.isSubmitting = false;
      },
    });
  }
}
