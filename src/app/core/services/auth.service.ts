import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserApiProfileBody {
  id: number;
  display_name: string | null;
  email: string | null;
  mobile_number: string | null;
  username: string | null;
  role: string | null;
  bio: string | null;
  avatar_url: string | null;
  preferred_language: string | null;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  payment_methods: unknown[];
  addiction_profile?: {
    id: number;
    addiction_duration_id?: number | null;
    education_level_id?: number | null;
    had_prior_treatment?: boolean | null;
    addiction_reason?: string | null;
    days_clean?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
  } | null;
  substances?: Array<{ id: number; name_ar: string; name_en: string }>;
}

export interface UserApiResponse {
  custom_code: number;
  status: boolean;
  message: string;
  body: UserApiProfileBody;
  info: string;
}

export interface RegisterData {
  display_name: string;
  mobile_number: string;
  password: string;
  preferred_language: string;
  addiction_duration_id: number;
  education_level_id: number;
  had_prior_treatment: boolean;
  substance_ids: number[];
  treatment_type_ids: number[];
  addiction_reason: string;
  days_clean: number;
}

export interface LoginCredentials {
  mobile_number: string;
  password: string;
}

export interface SessionApiResponse {
  custom_code: number;
  status: boolean;
  message: string;
  body: {
    sessions: Array<{
      id: number;
      group_id?: number;
      group_name?: string;
      group_name_ar?: string;
      group_name_en?: string;
      substance_category_id?: number;
      substance_category_name_ar?: string;
      substance_category_name_en?: string;
      instructor_id: number;
      instructor_name: string;
      session_number: number;
      title?: string;
      session_type: string;
      session_type_label?: string;
      status: string;
      scheduled_at: string;
      date: string;
      time: string;
      started_at: string | null;
      ended_at: string | null;
      duration_minutes: number;
      jitsi_room_name?: string;
      jitsi_jwt_issued_at?: string | null;
      session_metadata?: {
        title: string;
        max_participants: number;
      };
      max_participants?: number;
      current_participants?: number;
      is_full?: boolean;
      price: number;
      formatted_price: string;
      created_at?: string;
      updated_at?: string;
      is_booked?: boolean;
      is_locked?: boolean;
      attendance?: {
        joined_at: string | null;
        left_at: string | null;
        was_present: boolean;
        has_rated: boolean;
        rating: number | null;
        comment: string | null;
      };
    }>;
  };
  info: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'user-data';
  private readonly AUTH_KEY = 'auth-token';
  private readonly PENDING_VERIFY_KEY = 'pending-verify-token';
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  register(payload: RegisterData): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}auth/register`, payload).pipe(
      tap((response: any) => {
        const token = response?.body?.token || response?.token;
        if (token) {
          this.setAuthToken(token);
          this.clearPendingVerificationToken();
        }
      })
    );
  }

 verifyOtp(payload: { otp: string; token: string }): Observable<any> {
  return this.http.post(
    `${this.apiBaseUrl}auth/verify`,
    {
      otp: payload.otp,
    },
    {
      headers: new HttpHeaders({
        Authorization: `Bearer ${payload.token}`,
      }),
    }
  );
}

  login(credentials: LoginCredentials): Observable<any> {
    const body = new HttpParams()
      .set('mobile_number', credentials.mobile_number)
      .set('password', credentials.password);

    return this.http.post(`${this.apiBaseUrl}auth/login`, body.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }).pipe(
      tap((response: any) => {
        const token = response?.body?.token || response?.token;

        if (token) {
          this.setAuthToken(token);
        }
      }),
    );
  }

  getUserProfile(): Observable<UserApiResponse> {
    const token = this.getAuthToken();
    const headers = this.buildAuthHeaders(token);

    return this.http.get<UserApiResponse>(`${this.apiBaseUrl}user`, { headers });
  }

  getUpcomingSessions(): Observable<SessionApiResponse> {
    const token = this.getAuthToken();
    const headers = this.buildAuthHeaders(token);

    return this.http.get<SessionApiResponse>(`${this.apiBaseUrl}sessions/upcoming`, { headers });
  }

  getAttendedSessions(): Observable<SessionApiResponse> {
    const token = this.getAuthToken();
    const headers = this.buildAuthHeaders(token);

    return this.http.get<SessionApiResponse>(`${this.apiBaseUrl}sessions/attended`, { headers });
  }

  getUpcomingUnpaidSessions(): Observable<SessionApiResponse> {
    const token = this.getAuthToken();
    const headers = this.buildAuthHeaders(token);

    return this.http.get<SessionApiResponse>(`${this.apiBaseUrl}sessions/upcoming/unpaid`, { headers });
  }

  getSessionsHistory(): Observable<SessionApiResponse> {
  return this.http.get<SessionApiResponse>(`${this.apiBaseUrl}sessions`);
}
  saveRegisterData(data: Partial<RegisterData>): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  getRegisterData(): RegisterData | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.AUTH_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.clearData();
  }

  clearData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  saveAuthToken(token: string): void {
    this.setAuthToken(token);
  }

  getPendingVerificationToken(): string | null {
    return localStorage.getItem(this.PENDING_VERIFY_KEY);
  }

  clearPendingVerificationToken(): void {
    localStorage.removeItem(this.PENDING_VERIFY_KEY);
  }

  private setPendingVerificationToken(token: string): void {
    localStorage.setItem(this.PENDING_VERIFY_KEY, token);
  }

  private setAuthToken(token: string): void {
    localStorage.setItem(this.AUTH_KEY, token);
  }

  private buildAuthHeaders(token: string | null): HttpHeaders {
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('auth-token', token ?? '');
  }
}
