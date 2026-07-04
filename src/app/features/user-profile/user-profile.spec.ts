import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from './user-profile';

describe('UserProfile', () => {
  let component: UserProfile;
  let authServiceStub: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceStub = jasmine.createSpyObj('AuthService', ['getRegisterData', 'getAuthToken', 'getUserProfile', 'getUpcomingSessions', 'getUpcomingUnpaidSessions']);

    authServiceStub.getRegisterData.and.returnValue(null);
    authServiceStub.getAuthToken.and.returnValue('token');
    authServiceStub.getUserProfile.and.returnValue(of({
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
    authServiceStub.getUpcomingSessions.and.returnValue(of({
      custom_code: 2000,
      status: true,
      message: 'Data retrieved successfully.',
      body: {
        sessions: [
          {
            id: 62,
            group_id: 1,
            group_name: 'المثبطات',
            group_name_ar: 'المثبطات',
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

    authServiceStub.getUpcomingUnpaidSessions.and.returnValue(of({
      custom_code: 2000,
      status: true,
      message: 'Data retrieved successfully.',
      body: {
        sessions: [
          {
            id: 70,
            group_id: 1,
            group_name: 'المثبطات',
            group_name_ar: 'المثبطات',
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

    TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ],
    });

    const fixture = TestBed.createComponent(UserProfile);
    component = fixture.componentInstance;
  });

  it('loads sessions from both ticket APIs and maps them into tickets and history', () => {
    component.loadSessions();

    expect(component.sessions.length).toBe(2);
    expect(component.sessions[0].specialist).toBe('Dr. Ahmed Sayed');
    expect(component.sessions[0].type).toBe('جلسة جماعية');
    expect(component.sessions[0].available).toBeTrue();
    expect(component.historyTickets.length).toBe(2);
    expect(component.historyTickets[0].status).toBe('upcoming');
    expect(component.historyTickets[0].specialist).toBe('Dr. Ahmed Sayed');
  });

  it('shows an empty-state message when no sessions are returned', () => {
    authServiceStub.getUpcomingSessions.and.returnValue(of({
      custom_code: 2000,
      status: true,
      message: 'Data retrieved successfully.',
      body: { sessions: [] },
      info: 'from response action',
    }));
    authServiceStub.getUpcomingUnpaidSessions.and.returnValue(of({
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
