import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Session info passed via query params
  sessionType: 'individual' | 'group' = 'group';
  sessionNumber: number | null = null;
  sessionTitle = '';
  sessionDate = '';
  sessionTime = '';
  sessionSpecialist = '';
  sessionPrice = '';

  // Card form fields
  cardNumber = '';
  cardHolder = '';
  expiryDate = '';
  cvv = '';

  // UI state
  cardFlipped = false;
  submitted = false;
  submitting = false;
  formError = '';

  // Card brand detection
  get cardBrand(): 'visa' | 'mastercard' | 'unknown' {
    const num = this.cardNumber.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'mastercard';
    return 'unknown';
  }

  get formattedCardNumber(): string {
    const raw = this.cardNumber.replace(/\s/g, '');
    const masked = raw.padEnd(16, '•');
    return masked.replace(/(.{4})/g, '$1 ').trim();
  }

  get displayCardHolder(): string {
    return this.cardHolder.trim() || 'CARDHOLDER NAME';
  }

  get displayExpiry(): string {
    return this.expiryDate || 'MM/YY';
  }

  get displayCvv(): string {
    return this.cvv ? '•'.repeat(this.cvv.length) : '•••';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.sessionType = params['type'] === 'individual' ? 'individual' : 'group';
      this.sessionNumber = params['sessionNumber'] ? Number(params['sessionNumber']) : null;
      this.sessionTitle = params['title'] ?? '';
      this.sessionDate = params['date'] ?? '';
      this.sessionTime = params['time'] ?? '';
      this.sessionSpecialist = params['specialist'] ?? 'فريق Revive';
      this.sessionPrice = params['price'] ?? '';
      this.cardHolder = params['name'] ?? '';
    });
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();
    this.cardNumber = value;
    input.value = value;
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    this.expiryDate = value;
    input.value = value;
  }

  formatCvv(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 4);
    this.cvv = value;
    input.value = value;
  }

  canSubmit(): boolean {
    const rawCard = this.cardNumber.replace(/\s/g, '');
    return (
      rawCard.length === 16 &&
      this.cardHolder.trim().length >= 3 &&
      this.expiryDate.length === 5 &&
      this.cvv.length >= 3
    );
  }

  submitPayment(): void {
    if (!this.canSubmit()) {
      this.formError = 'يرجى التحقق من بيانات البطاقة وإكمال جميع الحقول.';
      return;
    }
    this.formError = '';
    this.submitting = true;

    setTimeout(() => {
      this.submitting = false;
      this.submitted = true;
    }, 1800);
  }

  goBack(): void {
    this.router.navigate(['/user-profile']);
  }
}
