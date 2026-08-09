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
    { flag: '🇰🇼', name: 'الكويت', dialCode: '+965' },
    { flag: '🇶🇦', name: 'قطر', dialCode: '+974' },
    { flag: '🇧🇭', name: 'البحرين', dialCode: '+973' },
    { flag: '🇴🇲', name: 'عُمان', dialCode: '+968' },
    { flag: '🇯🇴', name: 'الأردن', dialCode: '+962' },
    { flag: '🇱🇧', name: 'لبنان', dialCode: '+961' },
    { flag: '🇮🇶', name: 'العراق', dialCode: '+964' },
    { flag: '🇵🇸', name: 'فلسطين', dialCode: '+970' },
    { flag: '🇸🇾', name: 'سوريا', dialCode: '+963' },
    { flag: '🇾🇪', name: 'اليمن', dialCode: '+967' },
    { flag: '🇱🇾', name: 'ليبيا', dialCode: '+218' },
    { flag: '🇸🇩', name: 'السودان', dialCode: '+249' },
    { flag: '🇹🇳', name: 'تونس', dialCode: '+216' },
    { flag: '🇩🇿', name: 'الجزائر', dialCode: '+213' },
    { flag: '🇲🇦', name: 'المغرب', dialCode: '+212' },
    { flag: '🇲🇷', name: 'موريتانيا', dialCode: '+222' },
    { flag: '🇸🇴', name: 'الصومال', dialCode: '+252' },
    { flag: '🇩🇯', name: 'جيبوتي', dialCode: '+253' },
    { flag: '🇰🇲', name: 'جزر القمر', dialCode: '+269' },
    { flag: '🇺🇸', name: 'أمريكا / كندا', dialCode: '+1' },
    { flag: '🇬🇧', name: 'المملكة المتحدة', dialCode: '+44' },
    { flag: '🇩🇪', name: 'ألمانيا', dialCode: '+49' },
    { flag: '🇫🇷', name: 'فرنسا', dialCode: '+33' },
    { flag: '🇮🇹', name: 'إيطاليا', dialCode: '+39' },
    { flag: '🇪🇸', name: 'إسبانيا', dialCode: '+34' },
    { flag: '🇹🇷', name: 'تركيا', dialCode: '+90' },
    { flag: '🇷🇺', name: 'روسيا', dialCode: '+7' },
    { flag: '🇨🇳', name: 'الصين', dialCode: '+86' },
    { flag: '🇮🇳', name: 'الهند', dialCode: '+91' },
    { flag: '🇵🇰', name: 'باكستان', dialCode: '+92' },
    { flag: '🇧🇩', name: 'بنغلاديش', dialCode: '+880' },
    { flag: '🇮🇩', name: 'إندونيسيا', dialCode: '+62' },
    { flag: '🇲🇾', name: 'ماليزيا', dialCode: '+60' },
    { flag: '🇵🇭', name: 'الفلبين', dialCode: '+63' },
    { flag: '🇳🇬', name: 'نيجيريا', dialCode: '+234' },
    { flag: '🇿🇦', name: 'جنوب إفريقيا', dialCode: '+27' },
    { flag: '🇧🇷', name: 'البرازيل', dialCode: '+55' },
    { flag: '🇦🇷', name: 'الأرجنتين', dialCode: '+54' },
    { flag: '🇲🇽', name: 'المكسيك', dialCode: '+52' },
    { flag: '🇦🇺', name: 'أستراليا', dialCode: '+61' },
    { flag: '🇳🇿', name: 'نيوزيلندا', dialCode: '+64' },
    { flag: '🇸🇬', name: 'سنغافورة', dialCode: '+65' },
    { flag: '🇸🇪', name: 'السويد', dialCode: '+46' },
    { flag: '🇳🇴', name: 'النرويج', dialCode: '+47' },
    { flag: '🇩🇰', name: 'الدنمارك', dialCode: '+45' },
    { flag: '🇫🇮', name: 'فنلندا', dialCode: '+358' },
    { flag: '🇳🇱', name: 'هولندا', dialCode: '+31' },
    { flag: '🇧🇪', name: 'بلجيكا', dialCode: '+32' },
    { flag: '🇨🇭', name: 'سويسرا', dialCode: '+41' },
    { flag: '🇦🇹', name: 'النمسا', dialCode: '+43' },
    { flag: '🇬🇷', name: 'اليونان', dialCode: '+30' },
    { flag: '🇵🇹', name: 'البرتغال', dialCode: '+351' },
    { flag: '🇮🇪', name: 'أيرلندا', dialCode: '+353' },
    { flag: '🇵🇱', name: 'بولندا', dialCode: '+48' },
    { flag: '🇷🇴', name: 'رومانيا', dialCode: '+40' },
    { flag: '🇺🇦', name: 'أوكرانيا', dialCode: '+380' },
    { flag: '🇯🇵', name: 'اليابان', dialCode: '+81' },
    { flag: '🇰🇷', name: 'كوريا الجنوبية', dialCode: '+82' },
    { flag: '🇹🇭', name: 'تايلاند', dialCode: '+66' },
    { flag: '🇻🇳', name: 'فيتنام', dialCode: '+84' },
    { flag: '🇮🇷', name: 'إيران', dialCode: '+98' },
  ];
  
  readonly loginForm = this.fb.nonNullable.group({
    mobile_number: ['', [Validators.required]],
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
    const trimmed = (value || '').trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('+')) return trimmed;
    const digits = trimmed.replace(/\D/g, '');
    return digits ? `${this.selectedCountryDialCode}${digits}` : trimmed;
  }

  getFieldError(controlName: 'mobile_number' | 'password'): string | null {
    const control = this.loginForm.get(controlName);

    if (!control || !control.touched || !control.invalid) {
      return null;
    }

    if (control.hasError('required')) {
      return controlName === 'mobile_number' ? 'رقم الواتساب مطلوب' : 'كلمة المرور مطلوبة';
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
