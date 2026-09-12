import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { NotificationService } from '../notification/notification.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let mockAuthService: { getIdToken: ReturnType<typeof vi.fn> };
  let notificationService: NotificationService;
  let router: Router;

  beforeEach(() => {
    mockAuthService = {
      getIdToken: vi.fn().mockResolvedValue(null),
    };

    const mockRouter = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        NotificationService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    notificationService.clearAll();
  });

  it('should attach Authorization: Bearer <token> header when user is logged in', async () => {
    mockAuthService.getIdToken.mockResolvedValue('test-jwt-token-xyz');

    http.get<{ ok: boolean }>('/api/workout/list').subscribe((res) => {
      expect(res.ok).toBe(true);
    });

    // Wait for the async getIdToken promise in interceptor
    await Promise.resolve();

    const req = httpMock.expectOne('/api/workout/list');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-jwt-token-xyz');

    req.flush({ ok: true });
  });

  it('should not attach Authorization header when token is null', async () => {
    mockAuthService.getIdToken.mockResolvedValue(null);

    http.get<{ ok: boolean }>('/api/workout/list').subscribe((res) => {
      expect(res.ok).toBe(true);
    });

    await Promise.resolve();

    const req = httpMock.expectOne('/api/workout/list');
    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({ ok: true });
  });

  it('should not overwrite existing Authorization header', async () => {
    mockAuthService.getIdToken.mockResolvedValue('custom-jwt');

    http
      .get<{ ok: boolean }>('/api/custom', {
        headers: { Authorization: 'Basic user:pass' },
      })
      .subscribe((res) => {
        expect(res.ok).toBe(true);
      });

    await Promise.resolve();

    const req = httpMock.expectOne('/api/custom');
    expect(req.request.headers.get('Authorization')).toBe('Basic user:pass');

    req.flush({ ok: true });
  });

  it('should catch 401 response and display on-screen notification', async () => {
    const showErrorSpy = vi.spyOn(notificationService, 'showError');
    let caughtError: unknown;

    http.get('/api/protected').subscribe({
      next: () => {
        expect.unreachable('Should have failed with 401');
      },
      error: (err) => {
        caughtError = err;
      },
    });

    await Promise.resolve();

    const req = httpMock.expectOne('/api/protected');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(caughtError).toBeInstanceOf(HttpErrorResponse);
    expect(showErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('401'),
      expect.objectContaining({
        label: 'Zaloguj się',
        callback: expect.any(Function),
      }),
      expect.any(Number)
    );
  });

  it('should navigate to /login when 401 notification action callback is triggered', async () => {
    let capturedAction: { label: string; callback: () => void } | undefined;
    vi.spyOn(notificationService, 'showError').mockImplementation((_msg, action) => {
      capturedAction = action;
      return 'notif-1';
    });

    http.get('/api/protected').subscribe({
      next: () => {},
      error: () => {},
    });

    await Promise.resolve();

    const req = httpMock.expectOne('/api/protected');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(capturedAction).toBeDefined();
    capturedAction?.callback();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should catch 403 response and display on-screen notification', async () => {
    const showErrorSpy = vi.spyOn(notificationService, 'showError');

    http.get('/api/forbidden').subscribe({
      next: () => {
        expect.unreachable('Should have failed with 403');
      },
      error: () => {},
    });

    await Promise.resolve();

    const req = httpMock.expectOne('/api/forbidden');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

    expect(showErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('403'),
      expect.objectContaining({
        label: 'Zaloguj się',
        callback: expect.any(Function),
      }),
      expect.any(Number)
    );
  });

  it('should catch status 0 (network/CORS error) and display on-screen notification', async () => {
    const showErrorSpy = vi.spyOn(notificationService, 'showError');

    http.get('/api/network-error').subscribe({
      next: () => {
        expect.unreachable('Should have failed with status 0');
      },
      error: () => {},
    });

    await Promise.resolve();

    const req = httpMock.expectOne('/api/network-error');
    req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

    expect(showErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('status 0'),
      undefined,
      expect.any(Number)
    );
  });
});
