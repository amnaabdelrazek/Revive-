import { ChangeDetectorRef, TestBed } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from './user-profile';

describe('UserProfile', () => {
  let component: UserProfile;
  let authServiceStub: {
    getRegisterData: ReturnType<typeof vi.fn>;
    getAuthToken: ReturnType<typeof vi.fn>;
    getUserProfile: ReturnType<typeof vi.fn>;
    getUpcomingSessions: ReturnType<typeof vi.fn>;
    getUpcomingUnpaidSessions: ReturnType<typeof vi.fn>;
    getUpcomingUnpaidIndividualSessions: ReturnType<typeof vi.fn>;
  };
  let cdrStub: {
    markForCheck: ReturnType<typeof vi.fn>;
    detectChanges: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authServiceStub = {
      getRegisterData: vi.fn(),
      getAuthToken: vi.fn(),
      getUserProfile: vi.fn(),
      getUpcomingSessions: vi.fn(),
      getUpcomingUnpaidSessions: vi.fn(),
      getUpcomingUnpaidIndividualSessions: vi.fn(),
    };

    cdrStub = {
      markForCheck: vi.fn(),
      detectChanges: vi.fn(),
    };

    authServiceStub.getRegisterData.mockReturnValue(null);
    authServiceStub.getAuthToken.mockReturnValue('token');
    authServiceStub.getUserProfile.mockReturnValue(of({
      custom_code: 2000,
      status: true,
      message: 'ok',
      body: {
        id: 1,
        display_name: 'Test User',
        email: 'test@example.com',
        mobile_number: '01000000000',
        username: null,
        role: null,
        bio: null,
        avatar_url: null,
        preferred_language: null,
        is_active: true,
        email_verified_at: null,
        created_at: null,
        updated_at: null,
        payment_methods: [],
      },
      info: 'ok',
    }));
    authServiceStub.getUpcomingSessions.mockReturnValue(of({
      custom_code: 2000,
      status: true,
      message: 'Data retrieved successfully.',
      body: {
        sessions: [
          {
            id: 62,
            group_id: 1,
            group_name: 'المثبتات',
            group_name_ar: 'المثبتات',
            group_name_en: 'Depressants',
            instructor_id: 4,
            instructor_name: 'Dr. Ahmed Sayed',
            session_number: 2,
            title: 'Session',
            session_type: 'group',
            session_type_label: 'Group Session',
            status: 'upcoming',
            scheduled_at: '26/06/2026 00:02:50',
            date: '26/06/2026',
            time: '00:02:50',
            started_at: '25/06/2026 10:22:05',
            ended_at: '25/06/2026 11:07:05',
            duration_minutes: 45,
            jitsi_room_name: 'demo-room',
            jitsi_jwt_issued_at: null,
            session_metadata: {
              title: 'Session',
              max_participants: 15,
            },
            max_participants: 15,
            current_participants: 1,
            is_full: false,
            price: 1200,
            formatted_price: '1200 EGP',
            created_at: '24/06/2026 01:43:37',
            updated_at: '25/06/2026 12:24:50',
            is_booked: false,
            is_locked: false,
          },
        ],
      },
      info: 'from response action',
    }));

    authServiceStub.getUpcomingUnpaidSessions.mockReturnValue(of({
      custom_code: 2000,
      status: true,
      message: 'Data retrieved successfully.',
      body: {
        sessions: [
          {
            id: 70,
            group_id: 1,
            group_name: 'المثبتات',
            group_name_ar: 'المثبتات',
            group_name_en: 'Depressants',
            instructor_id: 4,
            instructor_name: 'Dr. Ahmed Sayed',
            session_number: 15,
            title: 'Session',
            session_type: 'group',
            session_type_label: 'Group Session',
            status: 'scheduled',
            scheduled_at: '05/07/2026 14:45:50',
            date: '05/07/2026',
            time: '14:45:50',
            started_at: null,
            ended_at: null,
            duration_minutes: 45,
            jitsi_room_name: 'demo-room',
            jitsi_jwt_issued_at: null,
            session_metadata: {
              title: 'Session',
              max_participants: 15,
            },
            max_participants: 15,
            current_participants: 1,
            is_full: false,
            price: 1200,
            formatted_price: '1200 EGP',
            created_at: '04/07/2026 14:35:32',
            updated_at: '04/07/2026 14:35:32',
            is_booked: false,
            is_locked: true,
          },
        ],
      },
      info: 'from response action',
    }));

    authServiceStub.getUpcomingUnpaidIndividualSessions.mockReturnValue(of({
      custom_code: 2000,
      status: true,
      message: 'Data retrieved successfully.',
      body: { sessions: [] },
      info: 'from response action',
    }));

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ChangeDetectorRef, useValue: cdrStub },
      ],
    });

    component = TestBed.runInInjectionContext(() => new UserProfile());
  });

  it('loads sessions from both ticket APIs and maps them into tickets and history', () => {
    component.loadSessions();

    expect(component.sessions.length).toBe(1);
    expect(component.sessions[0].specialist).toBe('Dr. Ahmed Sayed');
    expect(component.sessions[0].type).toBe('جلسة جماعية');
    expect(component.sessions[0].available).toBe(true);
    expect(component.historyTickets.length).toBe(2);
    expect(component.historyTickets[0].status).toBe('upcoming');
    expect(component.historyTickets[0].specialist).toBe('Dr. Ahmed Sayed');
  });

  it('shows every unpaid individual session in the popup list', () => {
    authServiceStub.getUpcomingUnpaidIndividualSessions.mockReturnValue(of({
      custom_code: 2000,
      status: true,
      message: 'Data retrieved successfully.',
      body: {
        sessions: [
          {
            id: 81,
            instructor_id: 4,
            instructor_name: 'Dr. Ahmed Sayed',
            session_number: 1,
            title: 'Individual intake',
            session_type: 'individual',
            session_type_label: 'Individual Session',
            status: 'scheduled',
            scheduled_at: '06/07/2026 14:45:50',
            date: '06/07/2026',
            time: '14:45:50',
            started_at: null,
            ended_at: null,
            duration_minutes: 45,
            session_metadata: {
              title: 'Individual intake',
              max_participants: 1,
            },
            max_participants: 1,
            current_participants: 0,
            is_full: false,
            price: 1200,
            formatted_price: '1200 EGP',
            created_at: '05/07/2026 14:35:32',
            updated_at: '05/07/2026 14:35:32',
            is_booked: false,
            is_locked: false,
          },
          {
            id: 82,
            instructor_id: 4,
            instructor_name: 'Dr. Ahmed Sayed',
            session_number: 2,
            title: 'Individual follow-up',
            session_type: 'individual',
            session_type_label: 'Individual Session',
            status: 'scheduled',
            scheduled_at: '07/07/2026 14:45:50',
            date: '07/07/2026',
            time: '14:45:50',
            started_at: null,
            ended_at: null,
            duration_minutes: 45,
            session_metadata: {
              title: 'Individual follow-up',
              max_participants: 1,
            },
            max_participants: 1,
            current_participants: 0,
            is_full: false,
            price: 1200,
            formatted_price: '1200 EGP',
            created_at: '06/07/2026 14:35:32',
            updated_at: '06/07/2026 14:35:32',
            is_booked: false,
            is_locked: false,
          },
        ],
      },
      info: 'from response action',
    }));

    component.loadSessions();

    expect(component.individualSessions.length).toBe(2);
    expect(component.individualSessions[0].sessionNumber).toBe(1);
    expect(component.individualSessions[1].sessionNumber).toBe(2);
    expect(component.hasAvailableIndividualSession).toBe(true);
  });

  it('shows an empty-state message when no sessions are returned', () => {
    authServiceStub.getUpcomingSessions.mockReturnValue(of({
      custom_code: 2000,
      status: true,
      message: 'Data retrieved successfully.',
      body: { sessions: [] },
      info: 'from response action',
    }));
    authServiceStub.getUpcomingUnpaidSessions.mockReturnValue(of({
      custom_code: 2000,
      status: true,
      message: 'Data retrieved successfully.',
      body: { sessions: [] },
      info: 'from response action',
    }));
    authServiceStub.getUpcomingUnpaidIndividualSessions.mockReturnValue(of({
      custom_code: 2000,
      status: true,
      message: 'Data retrieved successfully.',
      body: { sessions: [] },
      info: 'from response action',
    }));

    component.loadSessions();

    expect(component.sessions.length).toBe(0);
    expect(component.historyTickets.length).toBe(0);
  });
});
