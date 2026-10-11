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

  // InstaPay Info
  readonly instapayAccount = 'hokhalifa94@instapay';
  readonly qrImageUrl = '/assets/images/instapay.jpeg';
  copied = false;

  // Sender verification info
  senderName = '';
  senderPhone = '';
  transferReference = '';

  // UI state
  submitted = false;
  submitting = false;
  formError = '';

  sessionId: number | null = null;
  sessionDay = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.sessionId = params['sessionId'] ? Number(params['sessionId']) : null;
      this.sessionType = params['type'] === 'individual' ? 'individual' : 'group';
      this.sessionNumber = params['sessionNumber'] ? Number(params['sessionNumber']) : null;
      this.sessionTitle = params['title'] ?? '';
      this.sessionDay = params['day'] ?? '';
      this.sessionDate = params['date'] ?? '';
      this.sessionTime = params['time'] ?? '';
      this.sessionSpecialist = params['specialist'] ?? 'فريق Revive';
      this.sessionPrice = params['price'] ?? '';
      this.senderName = params['name'] ?? '';
      this.senderPhone = params['phone'] ?? '';
    });
  }

  copyInstapayAccount(): void {
    navigator.clipboard?.writeText(this.instapayAccount).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2500);
    });
  }

  confirmTransfer(): void {
    this.formError = '';
    this.submitting = true;

    // Save session to local storage as booked/upcoming
    try {
      const bookedSession = {
        id: this.sessionId ?? Date.now(),
        sessionNumber: this.sessionNumber,
        title: this.sessionTitle || (this.sessionNumber ? `جلسة #${this.sessionNumber}` : 'جلسة علاجية'),
        day: this.sessionDay || 'اليوم',
        date: this.sessionDate,
        time: this.sessionTime,
        specialist: this.sessionSpecialist,
        type: this.sessionType === 'individual' ? 'جلسة فردية' : 'جلسة جماعية',
        status: 'upcoming',
        statusLabel: 'قادم',
        amount: this.sessionPrice || '1200 ج.م',
      };

      const existingRaw = localStorage.getItem('revive_booked_sessions');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      // Prevent duplicates
      const filtered = existing.filter((s: any) => s.id !== bookedSession.id);
      filtered.unshift(bookedSession);
      localStorage.setItem('revive_booked_sessions', JSON.stringify(filtered));
    } catch (e) {
      console.error('Error saving booked session locally', e);
    }

    setTimeout(() => {
      this.submitting = false;
      this.submitted = true;
    }, 1200);
  }

  goBack(): void {
    this.router.navigate(['/user-profile'], { queryParams: { tab: 'available' } });
  }
}
