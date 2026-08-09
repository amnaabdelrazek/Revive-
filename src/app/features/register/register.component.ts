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

  substanceCategories = [
    { title: 'المثبطات', description: 'حشيش، بانجو، هيدرو', ids: [1, 2, 3] },
    { title: 'المهدئات', description: 'أفيون، ترامادول، هيروين', ids: [4, 5, 6] },
    { title: 'المنشطات', description: 'شابو، كوكايين، إكستاسي', ids: [7, 8, 9] },
    { title: 'المهلوسات', description: 'LSD, Ice / Crystal Meth', ids: [10, 11] },
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
    mobile_number: ['', [Validators.required]],
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

  isCategorySelected(cat: { ids: number[] }): boolean {
    const currentIds: number[] = this.registerForm.value.substance_ids || [];
    return cat.ids.length > 0 && cat.ids.every(id => currentIds.includes(id));
  }

  selectSubstanceCategory(cat: { ids: number[] }): void {
    this.registerForm.get('substance_ids')?.setValue(cat.ids);
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
    const trimmed = (value || '').trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('+')) return trimmed;
    const digits = trimmed.replace(/\D/g, '');
    return digits ? `${this.selectedCountryDialCode}${digits}` : trimmed;
  }

  getFieldError(controlName: string): string | null {
    const control = this.registerForm.get(controlName);

    if (controlName === 'confirmPassword') {
      const confirmControl = this.registerForm.get('confirmPassword');
      if (!confirmControl || !confirmControl.touched) return null;
      if (confirmControl.hasError('required')) return 'تأكيد كلمة المرور مطلوب';
      const passwordVal = this.registerForm.get('password')?.value;
      if (passwordVal !== confirmControl.value) {
        return 'كلمتا المرور غير متطابقتين';
      }
      return null;
    }

    if (!control || !control.touched || !control.invalid) return null;

    if (control.hasError('required')) {
      const messages: Record<string, string> = {
        display_name: 'الاسم مطلوب',
        mobile_number: 'رقم الواتساب مطلوب',
        password: 'كلمة المرور مطلوبة',
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

    if (controlName === 'password' && control.hasError('minlength')) {
      return 'كلمة المرور يجب ألا تقل عن 8 أحرف';
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