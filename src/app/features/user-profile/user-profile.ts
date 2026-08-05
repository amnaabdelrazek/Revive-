import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, SessionApiResponse, UserApiProfileBody } from '../../core/services/auth.service';
import { TicketComponent, TicketData } from '../../shared/components/ticket/ticket.component';
import { forkJoin } from 'rxjs';

interface ProfileData {
  name: string;
  avatarUrl?: string | null;
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
  sessionNumber?: number;
  title?: string;
  day: string;
  date: string;
  time: string;
  specialist: string;
  type: string;
  sessionType: 'group' | 'individual';
  duration: string;
  price: string;
  availability: string;
  available: boolean;
  isFull: boolean;
  seatsReserved: number;
  seatsTotal: number;
  currentParticipants: number;
  maxParticipants: number;
  category: 'available' | 'upcoming' | 'paid';
  categoryLabel: string;
}

interface SessionTicket {
  id: number;
  sessionNumber?: number;
  title?: string;
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
  imports: [RouterLink, FormsModule, TicketComponent],
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
  attendedHistoryTickets: SessionTicket[] = [];
  upcomingHistoryTickets: SessionTicket[] = [];
  hasNoSessions = false;

  selectedSessionKey: string | null = null;
  bookingConfirmed = false;
  historyOpen = false;
  activeHistoryTab: 'attended' | 'upcoming' = 'attended';
  bookingModalOpen = false;
  historyLoading = false;
  historyError = '';
  senderName = '';
  whatsappNumber = '';
  instapayImage = '/assets/images/instapay.jpeg';
  instapayLink = 'https://ipn.eg/S/hokhalifa94/instapay/5WPolw';
  individualTicketPopupOpen = false;
  hasAvailableIndividualSession = false;

  allSessions: RecoverySession[] = [];
  groupSessions: RecoverySession[] = [];
  individualSessions: RecoverySession[] = [];
  upcomingIndividualTickets: SessionTicket[] = [];
  upcomingGroupTickets: SessionTicket[] = [];

  isUploadingAvatar = false;
  avatarUploadError = '';
  avatarUploadSuccess = '';

  onAvatarFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) {
      return;
    }

    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب ألا يتجاوز 5 ميجابايت.');
      return;
    }

    this.isUploadingAvatar = true;
    this.avatarUploadError = '';
    this.avatarUploadSuccess = '';

    this.authService.uploadAvatar(file).subscribe({
      next: (response) => {
        this.isUploadingAvatar = false;
        const relativeUrl = response?.body?.avatar_url || response?.avatar_url;
        if (relativeUrl) {
          this.profile.avatarUrl = relativeUrl;
          this.avatarUploadSuccess = 'تمت تحديث الصورة بنجاح!';
        }
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isUploadingAvatar = false;
        this.avatarUploadError = err.error?.message || 'حدث خطأ أثناء رفع الصورة.';
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  get selectedSession(): RecoverySession | undefined {
    return this.sessions.find((session) => session.selectionKey === this.selectedSessionKey)
      ?? this.individualSessions.find((session) => session.selectionKey === this.selectedSessionKey);
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

  get hasHistoryTickets(): boolean {
    return this.attendedHistoryTickets.length > 0 || this.upcomingHistoryTickets.length > 0;
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
      unpaidIndividual: this.authService.getUpcomingUnpaidIndividualSessions(),
    }).subscribe({
      next: ({ upcoming, unpaid, unpaidIndividual }) => {
        const mappedUpcoming = this.mapHistoryTickets(upcoming);
        this.upcomingIndividualTickets = mappedUpcoming.filter(t => t.type === 'جلسة فردية');
        this.upcomingGroupTickets = mappedUpcoming.filter(t => t.type === 'جلسة جماعية');

        const mappedUnpaid = this.mapSessions(this.mergeSessions(unpaid, unpaidIndividual));
        this.allSessions = mappedUnpaid;

        this.groupSessions = mappedUnpaid.filter(s => s.sessionType === 'group');
        this.sessions = this.groupSessions;
        this.individualSessions = mappedUnpaid.filter(s => s.sessionType === 'individual');
        this.hasNoSessions = this.sessions.length === 0;

        const availableIndividual = this.individualSessions.filter(s => !s.isFull);
        this.hasAvailableIndividualSession = availableIndividual.length > 0;

        const firstAvailable = this.sessions.find(s => s.available && !s.isFull);
        if (firstAvailable) {
          this.selectedSessionKey = firstAvailable.selectionKey;
        } else {
          this.selectedSessionKey = null;
        }

        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: () => {
        this.sessions = [];
        this.groupSessions = [];
        this.allSessions = [];
        this.individualSessions = [];
        this.upcomingIndividualTickets = [];
        this.upcomingGroupTickets = [];
        this.historyTickets = [];
        this.attendedHistoryTickets = [];
        this.upcomingHistoryTickets = [];
        this.hasNoSessions = true;
        this.hasAvailableIndividualSession = false;
        this.selectedSessionKey = null;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
    });
  }

  selectSession(session: RecoverySession): void {
    if (session.isFull || !session.available) {
      return;
    }
    this.selectedSessionKey = session.selectionKey;
    this.bookingConfirmed = false;
  }

  toTicketData(session: RecoverySession): TicketData {
    return {
      sessionNumber: session.sessionNumber,
      title: session.title,
      isFull: session.isFull,
      currentParticipants: session.currentParticipants,
      maxParticipants: session.maxParticipants,
      day: session.day,
      date: session.date,
      time: session.time,
      specialist: session.specialist,
      type: session.type,
      duration: session.duration,
      price: session.price,
      availability: session.availability,
      category: session.category,
      categoryLabel: session.categoryLabel,
      available: session.available,
      seatsReserved: session.seatsReserved,
      seatsTotal: session.seatsTotal,
    };
  }

  getSeatPercent(session: RecoverySession): number {
    if (!session.seatsTotal) {
      return 0;
    }

    return Math.round((session.seatsReserved / session.seatsTotal) * 100);
  }

  openHistory(): void {
    this.historyOpen = true;
    this.activeHistoryTab = 'attended';
    this.loadHistorySessions();
  }

  selectHistoryTab(tab: 'attended' | 'upcoming'): void {
    this.activeHistoryTab = tab;
  }

  loadHistorySessions(): void {
    this.historyLoading = true;
    this.historyError = '';

    forkJoin({
      attended: this.authService.getAttendedSessions(),
      upcoming: this.authService.getUpcomingSessions(),
      history: this.authService.getSessionsHistory(),
    }).subscribe({
      next: ({ attended, upcoming, history }) => {
        const attendedMapped = this.mapHistoryTickets(attended);
        const upcomingMapped = this.mapHistoryTickets(upcoming);
        const historyMapped = this.mapHistoryTickets(history);

        const ticketsMap = new Map<number, SessionTicket>();
        [...attendedMapped, ...upcomingMapped, ...historyMapped].forEach((ticket) => {
          ticketsMap.set(ticket.id, ticket);
        });

        const allPaid = Array.from(ticketsMap.values());

        this.attendedHistoryTickets = allPaid;
        this.upcomingHistoryTickets = upcomingMapped;
        this.historyTickets = allPaid;

        this.historyLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: () => {
        this.historyTickets = [];
        this.attendedHistoryTickets = [];
        this.upcomingHistoryTickets = [];
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
    if (!this.selectedSession || this.selectedSession.isFull || !this.selectedSession.available) {
      return;
    }
    this.navigateToPayment(this.selectedSession);
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

  navigateToPayment(session: RecoverySession): void {
    this.router.navigate(['/payment'], {
      queryParams: {
        type: session.sessionType,
        sessionNumber: session.sessionNumber ?? '',
        title: session.title ?? '',
        date: `${session.day}، ${session.date}`,
        time: session.time,
        specialist: session.specialist,
        price: session.price,
        name: this.profile.name,
        phone: this.profile.phone,
      },
    });
  }

  openIndividualTicketPopup(): void {
    this.individualTicketPopupOpen = true;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  closeIndividualTicketPopup(): void {
    this.individualTicketPopupOpen = false;
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
      avatarUrl: profileData?.avatar_url || null,
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
      case 'depressants': return 'المثبطات';
      case 'sedatives': return 'المهدئات';
      case 'stimulants': return 'المنشطات';
      case 'hallucinogens': return 'المهلوسات';
      case 'other': return 'أخرى';
      default: return value;
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
      case 1: return 'أقل من 6 شهور';
      case 2: return 'من 6 إلى 12 شهر';
      case 3: return 'من سنة إلى 3 سنوات';
      case 4: return 'أكثر من 3 سنوات';
      default: return '';
    }
  }

  private mapEducationIdToLabel(id: number | null | undefined): string {
    switch (id) {
      case 5: return 'بدون تعليم';
      case 6: return 'ابتدائي';
      case 7: return 'ثانوي / متوسط';
      case 8: return 'جامعي';
      case 9: return 'دراسات عليا';
      default: return '';
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
      case 'depressants': return 'حشيش، بانجو، هيدرو';
      case 'sedatives': return 'أفيون، ترامادول، هيروين';
      case 'stimulants': return 'شابو، كوكايين، إكستاسي';
      case 'hallucinogens': return 'LSD, Ice';
      case 'other': return 'نوع آخر';
      default: return '';
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
      body: { sessions: mergedSessions },
      info: upcomingResponse?.info ?? unpaidResponse?.info ?? 'from response action',
    };
  }

  private mapSessions(response: SessionApiResponse): RecoverySession[] {
    return (response?.body?.sessions ?? []).map((session, index) => {
      const status = session.status?.toLowerCase();
      const isFinished = status === 'finished' || status === 'completed' || status === 'cancelled';
      const currentParticipants = session.current_participants ?? 0;
      const maxParticipants = session.max_participants ?? session.session_metadata?.max_participants ?? 0;
      const isFull = !!session.is_full || (maxParticipants > 0 && currentParticipants >= maxParticipants);
      const isAvailable = !isFinished && !isFull && !session.is_booked;

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
        sessionNumber: session.session_number,
        title: session.title || session.session_metadata?.title || 'جلسة',
        day: this.formatSessionDay(session.date),
        date: this.formatSessionDate(session.date),
        time: this.formatSessionTime(session.time),
        specialist: session.instructor_name || 'فريق Revive',
        type: session.session_type === 'group' ? 'جلسة جماعية' : 'جلسة فردية',
        sessionType: (session.session_type === 'individual' ? 'individual' : 'group') as 'group' | 'individual',
        duration: `${session.duration_minutes ?? 0} دقيقة`,
        price: session.formatted_price || `${session.price} ج.م`,
        availability: isFinished ? 'انتهت' : isFull ? 'مكتمل' : 'متاح للحجز',
        available: isAvailable,
        isFull: isFull,
        seatsReserved: currentParticipants,
        seatsTotal: maxParticipants,
        currentParticipants: currentParticipants,
        maxParticipants: maxParticipants,
        category,
        categoryLabel,
      };
    });
  }

  private mapHistoryTickets(response: SessionApiResponse): SessionTicket[] {
    return (response?.body?.sessions ?? []).map((session) => {
      const status = session.status?.toLowerCase();
      const attendance = (session as any).attendance_status || (session as any).attendance?.status;

      let ticketStatus: SessionTicket['status'] = 'paid';
      let statusLabel = 'جلسة مدفوعة';

      if (status === 'finished' || status === 'completed') {
        ticketStatus = 'finished';
        statusLabel = attendance === 'absent' ? 'لم يتم الحضور (مدفوعة)' : 'تمت الجلسة (مدفوعة)';
      } else if (status === 'cancelled') {
        ticketStatus = 'cancelled';
        statusLabel = 'ملغية';
      } else if (status === 'upcoming' || status === 'scheduled') {
        ticketStatus = 'upcoming';
        statusLabel = 'قادمة (مدفوعة)';
      } else if (session.is_booked) {
        ticketStatus = 'paid';
        statusLabel = 'جلسة مدفوعة';
      }

      return {
        id: session.id,
        sessionNumber: session.session_number,
        title: session.title || session.session_metadata?.title,
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
    if (!parsed) { return ''; }
    return new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(parsed);
  }

  private formatSessionDate(value: string): string {
    const parsed = this.parseDate(value);
    if (!parsed) { return value; }
    return new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'short' }).format(parsed);
  }

  private formatSessionTime(value: string): string {
    if (!value) { return ''; }
    const [hours, minutes] = value.split(':').map((part) => Number(part));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) { return value; }
    const period = hours >= 12 ? 'م' : 'ص';
    const normalizedHours = hours % 12 || 12;
    return `${normalizedHours}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  private parseDate(value: string): Date | null {
    const parts = value.split('/');
    if (parts.length !== 3) { return null; }
    const [day, month, year] = parts;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
}
