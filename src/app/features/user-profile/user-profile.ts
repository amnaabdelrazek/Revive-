import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, SessionApiResponse, UserApiProfileBody } from '../../core/services/auth.service';
import { forkJoin } from 'rxjs';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  drugType: string;
  drugDetails: string;
  usageDuration: string;
  previousTreatment: string;
  education: string;
  addictionReason: string;
  joinedAt: string;
}

interface RecoverySession {
  id: number;
  selectionKey: string;
  day: string;
  date: string;
  time: string;
  specialist: string;
  type: string;
  duration: string;
  price: string;
  availability: string;
  available: boolean;
  seatsReserved: number;
  seatsTotal: number;
  category: 'available' | 'upcoming' | 'paid';
  categoryLabel: string;
}
interface SessionTicket {
  id: number;
  day: string;
  date: string;
  time: string;
  specialist: string;
  type: string;
  status: 'paid' | 'upcoming' | 'finished' | 'cancelled' | 'available';
  statusLabel: string;
  amount: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  profile: ProfileData = {
    name: '',
    email: '',
    phone: '',
    drugType: '',
    drugDetails: '',
    usageDuration: '',
    previousTreatment: '',
    education: '',
    addictionReason: '',
    joinedAt: '',
  };

  sessions: RecoverySession[] = [];
  historyTickets: SessionTicket[] = [];
  hasNoSessions = false;

selectedSessionKey: string | null = null;
bookingConfirmed = false;
  historyOpen = false;
  bookingModalOpen = false;
historyLoading = false;
historyError = '';
  senderName = '';
  whatsappNumber = '';
  instapayImage = '/assets/images/instapay.jpeg';
  instapayLink = 'https://ipn.eg/S/hokhalifa94/instapay/5WPolw';

  get selectedSession(): RecoverySession | undefined {
  return this.sessions.find((session) => session.selectionKey === this.selectedSessionKey);
  }

  get paidTickets(): SessionTicket[] {
    return this.historyTickets.filter((ticket) => ticket.status === 'paid');
  }

  get upcomingTickets(): SessionTicket[] {
    return this.historyTickets.filter((ticket) => ticket.status === 'upcoming');
  }

  get pendingTickets(): SessionTicket[] {
    return this.historyTickets.filter((ticket) => ticket.status === 'cancelled');
  }

  ngOnInit(): void {
    const storedData = this.authService.getRegisterData();

    if (!this.authService.getAuthToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getUserProfile().subscribe({
      next: (response) => {
        this.applyProfileFromApi(response?.body ?? null, storedData);
      },
      error: () => {
        this.applyFallbackProfile(storedData);
      },
    });

    this.loadSessions();
  }

  loadSessions(): void {
    this.hasNoSessions = false;

    forkJoin({
      upcoming: this.authService.getUpcomingSessions(),
      unpaid: this.authService.getUpcomingUnpaidSessions(),
    }).subscribe({
      next: ({ upcoming, unpaid }) => {
        const mergedSessions = this.mergeSessions(upcoming, unpaid);
        this.sessions = this.mapSessions(mergedSessions);
        this.hasNoSessions = this.sessions.length === 0;

       if (this.sessions.length) {
  this.selectedSessionKey = this.sessions[0].selectionKey;
} else {
  this.selectedSessionKey = null;
}

        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: () => {
        this.sessions = [];
        this.historyTickets = [];
        this.hasNoSessions = true;
        this.selectedSessionKey = null;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
    });
  }

  selectSession(session: RecoverySession): void {
  // if (!session.available || session.category === 'paid') {
  //   return;
  // }

  this.selectedSessionKey = session.selectionKey;
  this.bookingConfirmed = false;
}

  getSeatPercent(session: RecoverySession): number {
    return Math.round((session.seatsReserved / session.seatsTotal) * 100);
  }

  openHistory(): void {
    this.historyOpen = true;
    this.loadHistorySessions();
  }
  loadHistorySessions(): void {
  this.historyLoading = true;
  this.historyError = '';

  this.authService.getSessionsHistory().subscribe({
    next: (response) => {
      this.historyTickets = this.mapHistoryTickets(response);
      this.historyLoading = false;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    },
    error: () => {
      this.historyTickets = [];
      this.historyLoading = false;
      this.historyError = 'تعذر تحميل سجل الجلسات';
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    },
  });
}

  closeHistory(): void {
    this.historyOpen = false;
  }

  openBookingModal(): void {
    if (!this.selectedSession) {
      return;
    }

    this.senderName = this.profile.name || this.senderName;
    this.bookingModalOpen = true;
    this.bookingConfirmed = false;
  }

  closeBookingModal(): void {
    this.bookingModalOpen = false;
  }

  sendBooking(): void {
    if (!this.senderName.trim() || !this.whatsappNumber.trim()) {
      return;
    }

    this.bookingConfirmed = true;
  }

  logout(): void {
    this.authService.clearData();
    this.router.navigate(['/login']);
  }

  private applyProfileFromApi(profileData: UserApiProfileBody | null, storedData: any): void {
    const substance = profileData?.substances?.[0];
    const substanceName = substance?.name_en?.toLowerCase();
    const substanceCategory = this.mapSubstanceNameToCategory(substanceName) || this.mapSubstanceIdToCategory(storedData?.substance_ids?.[0]);
    const substanceLabel = substance?.name_ar || substance?.name_en || this.mapDrugTypeLabel(substanceCategory);

    this.profile = {
      name: profileData?.display_name || storedData?.display_name || 'مستخدم',
      email: profileData?.email || '',
      phone: profileData?.mobile_number || storedData?.mobile_number || '',
      drugType: substanceLabel,
      drugDetails: this.buildDrugDetails(substance, substanceCategory),
      usageDuration: this.mapDurationIdToLabel(profileData?.addiction_profile?.addiction_duration_id ?? storedData?.addiction_duration_id),
      previousTreatment: this.mapTreatmentLabel(profileData?.addiction_profile?.had_prior_treatment ?? storedData?.had_prior_treatment),
      education: this.mapEducationIdToLabel(profileData?.addiction_profile?.education_level_id ?? storedData?.education_level_id),
      addictionReason: profileData?.addiction_profile?.addiction_reason || storedData?.addiction_reason || 'لم يتم تقديم سبب محدد.',
      joinedAt: this.formatJoinedAt(profileData?.created_at || null),
    };

    this.senderName = this.profile.name;
    this.whatsappNumber = this.profile.phone;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  private applyFallbackProfile(storedData: any): void {
    const substanceCategory = this.mapSubstanceIdToCategory(storedData?.substance_ids?.[0]);

    this.profile = {
      name: storedData?.display_name || 'مستخدم',
      email: '',
      phone: storedData?.mobile_number || '',
      drugType: this.mapDrugTypeLabel(substanceCategory),
      drugDetails: this.mapDrugDetails(substanceCategory),
      usageDuration: this.mapDurationIdToLabel(storedData?.addiction_duration_id),
      previousTreatment: this.mapTreatmentLabel(storedData?.had_prior_treatment),
      education: this.mapEducationIdToLabel(storedData?.education_level_id),
      addictionReason: storedData?.addiction_reason || 'لم يتم تقديم سبب محدد.',
      joinedAt: new Intl.DateTimeFormat('ar-EG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    };

    this.senderName = this.profile.name;
    this.whatsappNumber = this.profile.phone;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  private mapDrugTypeLabel(value: string): string {
    switch (value) {
      case 'depressants':
        return 'المثبطات';
      case 'sedatives':
        return 'المهدئات';
      case 'stimulants':
        return 'المنشطات';
      case 'hallucinogens':
        return 'المهلوسات';
      case 'other':
        return 'أخرى';
      default:
        return value;
    }
  }

  private mapSubstanceNameToCategory(name: string | undefined): string {
    switch (name) {
      case 'hash':
      case 'cannabis':
      case 'weed':
      case 'bango':
      case 'hydra':
        return 'depressants';
      case 'opium':
      case 'tramadol':
      case 'heroin':
        return 'sedatives';
      case 'shabu':
      case 'cocaine':
      case 'ecstasy':
        return 'stimulants';
      case 'lsd':
      case 'ice':
      case 'crystal meth':
        return 'hallucinogens';
      default:
        return '';
    }
  }

  private mapSubstanceIdToCategory(id: number): string {
    switch (id) {
      case 1:
      case 2:
      case 3:
        return 'depressants';
      case 4:
      case 5:
      case 6:
        return 'sedatives';
      case 7:
      case 8:
      case 9:
        return 'stimulants';
      case 10:
      case 11:
        return 'hallucinogens';
      default:
        return 'other';
    }
  }

  private mapDurationIdToLabel(id: number | null | undefined): string {
    switch (id) {
      case 1:
        return 'أقل من 6 شهور';
      case 2:
        return 'من 6 إلى 12 شهر';
      case 3:
        return 'من سنة إلى 3 سنوات';
      case 4:
        return 'أكثر من 3 سنوات';
      default:
        return '';
    }
  }

  private mapEducationIdToLabel(id: number | null | undefined): string {
    switch (id) {
      case 5:
        return 'بدون تعليم';
      case 6:
        return 'ابتدائي';
      case 7:
        return 'ثانوي / متوسط';
      case 8:
        return 'جامعي';
      case 9:
        return 'دراسات عليا';
      default:
        return '';
    }
  }

  private mapTreatmentLabel(value: boolean | null | undefined): string {
    return value ? 'نعم' : 'لا';
  }

  private formatJoinedAt(value: string | null | undefined): string {
    if (!value) {
      return new Intl.DateTimeFormat('ar-EG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date());
    }

    const parts = value.split('/');
    if (parts.length !== 3) {
      return value;
    }

    const [day, month, rest] = parts;
    const [year] = rest.split(' ');
    const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(parsedDate);
  }

  private buildDrugDetails(substance: { name_ar?: string; name_en?: string } | undefined, substanceCategory: string): string {
    if (substance?.name_ar && substance?.name_en) {
      return `${substance.name_ar} (${substance.name_en})`;
    }

    if (substance?.name_ar || substance?.name_en) {
      return substance?.name_ar || substance?.name_en || '';
    }

    return this.mapDrugDetails(substanceCategory);
  }

  private mapDrugDetails(value: string): string {
    switch (value) {
      case 'depressants':
        return 'حشيش، بانجو، هيدرو';
      case 'sedatives':
        return 'أفيون، ترامادول، هيروين';
      case 'stimulants':
        return 'شابو، كوكايين، إكستاسي';
      case 'hallucinogens':
        return 'LSD, Ice';
      case 'other':
        return 'نوع آخر';
      default:
        return '';
    }
  }

  private mergeSessions(upcomingResponse: SessionApiResponse, unpaidResponse: SessionApiResponse): SessionApiResponse {
    const mergedSessions = [
      ...(upcomingResponse?.body?.sessions ?? []),
      ...(unpaidResponse?.body?.sessions ?? []),
    ];

    return {
      custom_code: upcomingResponse?.custom_code ?? unpaidResponse?.custom_code ?? 2000,
      status: upcomingResponse?.status ?? unpaidResponse?.status ?? true,
      message: upcomingResponse?.message ?? unpaidResponse?.message ?? 'Data retrieved successfully.',
      body: {
        sessions: mergedSessions,
      },
      info: upcomingResponse?.info ?? unpaidResponse?.info ?? 'from response action',
    };
  }

 private mapSessions(response: SessionApiResponse): RecoverySession[] {
  return (response?.body?.sessions ?? []).map((session, index) => {
    const status = session.status?.toLowerCase();
    const isFinished = status === 'finished' || status === 'completed' || status === 'cancelled';
    const isAvailable = !isFinished && !session.is_full && !session.is_locked && !session.is_booked;

    let category: RecoverySession['category'] = 'paid';
    let categoryLabel = 'مكتمل';

    if (status === 'upcoming' || status === 'scheduled') {
      category = 'upcoming';
      categoryLabel = 'قادم';
    } else if (isAvailable) {
      category = 'available';
      categoryLabel = 'متاح';
    }

    return {
      id: session.id,
      selectionKey: `${session.id}-${index}`,
      day: this.formatSessionDay(session.date),
      date: this.formatSessionDate(session.date),
      time: this.formatSessionTime(session.time),
      specialist: session.instructor_name || 'فريق Revive',
      type: session.session_type === 'group' ? 'جلسة جماعية' : 'جلسة فردية',
      duration: `${session.duration_minutes ?? 0} دقيقة`,
      price: session.formatted_price || `${session.price} ج.م`,
      availability: isFinished ? 'انتهت' : session.is_full ? 'مكتمل' : 'متاح للحجز',
      available: isAvailable,
      seatsReserved: session.current_participants,
      seatsTotal: session.max_participants,
      category,
      categoryLabel,
    };
  });
}

  private mapHistoryTickets(response: SessionApiResponse): SessionTicket[] {
  return (response?.body?.sessions ?? []).map((session) => {
    const status = session.status?.toLowerCase();

    let ticketStatus: SessionTicket['status'] = 'available';
    let statusLabel = 'متاحة للحجز';

    if (status === 'finished' || status === 'completed') {
      ticketStatus = 'finished';
      statusLabel = 'تمت الجلسة';
    } else if (status === 'cancelled') {
      ticketStatus = 'cancelled';
      statusLabel = 'ملغية';
    } else if (session.is_booked) {
      ticketStatus = 'paid';
      statusLabel = 'محجوزة';
    } else if (status === 'upcoming' || status === 'scheduled') {
      ticketStatus = 'upcoming';
      statusLabel = 'جلسة قادمة';
    }

    return {
      id: session.id,
      day: this.formatSessionDay(session.date),
      date: this.formatSessionDate(session.date),
      time: this.formatSessionTime(session.time),
      specialist: session.instructor_name || 'فريق Revive',
      type: session.session_type === 'group' ? 'جلسة جماعية' : 'جلسة فردية',
      status: ticketStatus,
      statusLabel,
      amount: session.formatted_price || `${session.price} ج.م`,
    };
  });
}

  private formatSessionDay(value: string): string {
    const parsed = this.parseDate(value);
    if (!parsed) {
      return '';
    }

    return new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(parsed);
  }

  private formatSessionDate(value: string): string {
    const parsed = this.parseDate(value);
    if (!parsed) {
      return value;
    }

    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'short',
    }).format(parsed);
  }

  private formatSessionTime(value: string): string {
    if (!value) {
      return '';
    }

    const [hours, minutes] = value.split(':').map((part) => Number(part));

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return value;
    }

    const period = hours >= 12 ? 'م' : 'ص';
    const normalizedHours = hours % 12 || 12;
    return `${normalizedHours}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  private parseDate(value: string): Date | null {
    const parts = value.split('/');
    if (parts.length !== 3) {
      return null;
    }

    const [day, month, year] = parts;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
}