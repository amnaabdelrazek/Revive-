import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss',
})
export class VerifyComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  isSubmitting = false;
  errorMessage = '';
  pendingToken = this.authService.getPendingVerificationToken() ?? '';
  phone = (history.state as { phone?: string } | undefined)?.phone ?? '';

  verifyForm = this.fb.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]],
  });

  submit(): void {
    if (this.verifyForm.invalid || !this.pendingToken) {
      this.verifyForm.markAllAsTouched();
      this.errorMessage = 'أدخل رمز التحقق الصحيح';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

   this.authService.verifyOtp({
  otp: this.verifyForm.value.otp!,
  token: this.pendingToken
}).subscribe({
  next: (response) => {
    const token = response?.body?.token || response?.token;

    if (token) {
      this.authService.saveAuthToken(token);
    }

    this.authService.clearPendingVerificationToken();
    this.router.navigate(['/user-profile']);
  },
  error: () => {
    this.isSubmitting = false;
    this.errorMessage = 'رمز التحقق غير صحيح أو منتهي الصلاحية';
  },
});
  }
}
