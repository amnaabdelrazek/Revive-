import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterData } from '../../core/services/auth.service';

type SelectField =
  | 'addiction_duration_id'
  | 'education_level_id'
  | 'had_prior_treatment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  showPassword = false;
  selectedCountryDialCode = '+20';

  countries = [
    { flag: '🇪🇬', name: 'مصر', dialCode: '+20' },
    { flag: '🇸🇦', name: 'السعودية', dialCode: '+966' },
    { flag: '🇦🇪', name: 'الإمارات', dialCode: '+971' },
    { flag: '🇯🇴', name: 'الأردن', dialCode: '+962' },
    { flag: '🇶🇦', name: 'قطر', dialCode: '+974' },
    { flag: '🇰🇼', name: 'الكويت', dialCode: '+965' },
  ];

  substances = [
    { title: 'حشيش', desc: 'المثبطات', id: 1 },
    { title: 'بانجو', desc: 'المثبطات', id: 2 },
    { title: 'هيدرو', desc: 'المثبطات', id: 3 },
    { title: 'أفيون', desc: 'المهدئات', id: 4 },
    { title: 'ترامادول', desc: 'المهدئات', id: 5 },
    { title: 'هيروين', desc: 'المهدئات', id: 6 },
    { title: 'شابو', desc: 'المنشطات', id: 7 },
    { title: 'كوكايين', desc: 'المنشطات', id: 8 },
    { title: 'إكستاسي', desc: 'المنشطات', id: 9 },
    { title: 'LSD', desc: 'المهلوسات', id: 10 },
    { title: 'Ice / Crystal Meth', desc: 'المهلوسات', id: 11 },
  ];

  durations = [
    { label: 'أقل من 6 شهور', id: 1 },
    { label: 'من 6 إلى 12 شهر', id: 2 },
    { label: 'من سنة إلى 3 سنوات', id: 3 },
    { label: 'أكثر من 3 سنوات', id: 4 },
  ];

  educationLevels = [
    { label: 'بدون تعليم', id: 5 },
    { label: 'ابتدائي', id: 6 },
    { label: 'ثانوي / متوسط', id: 7 },
    { label: 'جامعي', id: 8 },
    { label: 'دراسات عليا', id: 9 },
  ];

  priorTreatmentOptions = [
    { label: 'نعم', value: true },
    { label: 'لا', value: false },
  ];

  treatmentTypes = [
    { label: 'علاج في المستشفى', id: 10 },
    { label: 'علاج خارجي / مصحات', id: 11 },
    { label: 'علاج ذاتي', id: 12 },
    { label: 'علاج ديني', id: 13 },
  ];

  registerForm = this.fb.group({
    display_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    mobile_number: ['', [Validators.required, Validators.pattern(/^\d{6,15}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],

    preferred_language: ['ar'],
    addiction_duration_id: [null as number | null, Validators.required],
    education_level_id: [null as number | null, Validators.required],
    had_prior_treatment: [null as boolean | null, Validators.required],

    substance_ids: [[] as number[], Validators.required],
    treatment_type_ids: [[] as number[]],

    addiction_reason: [''],
    days_clean: [0, [Validators.required, Validators.min(0)]],
  });

  selectValue(field: SelectField, value: number | boolean): void {
    this.registerForm.get(field)?.setValue(value as never);
    this.registerForm.get(field)?.markAsTouched();

    if (field === 'had_prior_treatment' && value === false) {
      this.registerForm.get('treatment_type_ids')?.setValue([]);
    }
  }

  selectSubstance(id: number): void {
    this.registerForm.get('substance_ids')?.setValue([id]);
    this.registerForm.get('substance_ids')?.markAsTouched();
  }

  selectTreatmentType(id: number): void {
    this.registerForm.get('treatment_type_ids')?.setValue([id]);
    this.registerForm.get('treatment_type_ids')?.markAsTouched();
  }

  onCountryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCountryDialCode = target.value;
  }

  private normalizeMobileNumber(value: string | null | undefined): string {
    const digits = (value || '').replace(/\D/g, '');
    return digits ? `${this.selectedCountryDialCode}${digits}` : '';
  }

  getFieldError(controlName: string): string | null {
    const control = this.registerForm.get(controlName);

    if (!control || !control.touched || !control.invalid) return null;

    if (control.hasError('required')) {
      const messages: Record<string, string> = {
        display_name: 'الاسم مطلوب',
        mobile_number: 'رقم الواتساب مطلوب',
        password: 'كلمة المرور مطلوبة',
        confirmPassword: 'تأكيد كلمة المرور مطلوب',
        substance_ids: 'اختر نوع المخدر',
        addiction_duration_id: 'اختر فترة تعاطي المخدر',
        education_level_id: 'اختر المستوى التعليمي',
        had_prior_treatment: 'اختر هل يوجد علاج سابق أم لا',
        days_clean: 'عدد أيام التعافي مطلوب',
      };

      return messages[controlName] || 'هذا الحقل مطلوب';
    }

    if (controlName === 'display_name' && control.hasError('minlength')) {
      return 'يجب ألا يقل الاسم عن 3 أحرف';
    }

    if (controlName === 'display_name' && control.hasError('maxlength')) {
      return 'يجب ألا يزيد الاسم عن 20 حرفًا';
    }

    if (controlName === 'mobile_number' && control.hasError('pattern')) {
      return 'أدخل رقم واتساب  صحيح يبدأ بـ 10 أو 11 أو 12 أو 15';
    }

    if (controlName === 'password' && control.hasError('minlength')) {
      return 'كلمة المرور يجب ألا تقل عن 8 أحرف';
    }

    if (controlName === 'confirmPassword' && control.hasError('mismatch')) {
      return 'كلمتا المرور غير متطابقتين';
    }

    if (controlName === 'days_clean' && control.hasError('min')) {
      return 'عدد الأيام لا يمكن أن يكون أقل من صفر';
    }

    return 'القيمة غير صحيحة';
  }

  submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const rawValues = this.registerForm.getRawValue();

    if (rawValues.password !== rawValues.confirmPassword) {
      this.registerForm.get('confirmPassword')?.setErrors({ mismatch: true });
      this.registerForm.markAllAsTouched();
      return;
    }

    const payload = {
      display_name: rawValues.display_name!,
      mobile_number: this.normalizeMobileNumber(rawValues.mobile_number as string | null | undefined),
      password: rawValues.password!,
      preferred_language: rawValues.preferred_language!,
      addiction_duration_id: rawValues.addiction_duration_id!,
      education_level_id: rawValues.education_level_id!,
      had_prior_treatment: rawValues.had_prior_treatment!,
      substance_ids: rawValues.substance_ids!,
      treatment_type_ids: rawValues.had_prior_treatment ? rawValues.treatment_type_ids! : [],
      addiction_reason: rawValues.addiction_reason || '',
      days_clean: Number(rawValues.days_clean),
    };

    this.authService.register(payload as RegisterData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.registerForm.setErrors({ submitFailed: true });
      },
    });
  }
}