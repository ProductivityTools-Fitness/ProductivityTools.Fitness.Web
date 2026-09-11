import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal, computed } from '@angular/core';
import { User } from 'firebase/auth';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    const currentUserSignal = signal<User | null>(null);
    const isLoadingSignal = signal<boolean>(false);

    mockAuthService = {
      currentUser: currentUserSignal,
      isLoading: isLoadingSignal,
      isLoggedIn: computed(() => !!currentUserSignal()),
      userEmail: computed(() => currentUserSignal()?.email ?? null),
      displayName: computed(
        () => currentUserSignal()?.displayName || currentUserSignal()?.email || 'Test User'
      ),
      photoURL: computed(() => currentUserSignal()?.photoURL ?? null),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([{ path: 'workouts', component: LoginComponent }]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create LoginComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.loginWithGoogle and navigate on success', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

    mockAuthService.loginWithGoogle.mockResolvedValue({
      uid: '123',
      email: 'test@example.com',
    } as User);

    await component.loginWithGoogle();

    expect(mockAuthService.loginWithGoogle).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/workouts');
    expect(component.errorMessage()).toBeNull();
  });

  it('should display friendly error message when Google sign-in is cancelled by user', async () => {
    mockAuthService.loginWithGoogle.mockRejectedValue({
      code: 'auth/popup-closed-by-user',
    });

    await component.loginWithGoogle();

    expect(component.errorMessage()).toBe('Logowanie przez Google zostało anulowane.');
  });

  it('should display friendly error message when popup is blocked', async () => {
    mockAuthService.loginWithGoogle.mockRejectedValue({
      code: 'auth/popup-blocked',
    });

    await component.loginWithGoogle();

    expect(component.errorMessage()).toBe(
      'Okno logowania zostało zablokowane przez przeglądarkę. Zezwól na wyskakujące okienka.'
    );
  });

  it('should display logged in view and handle logout', async () => {
    mockAuthService.currentUser.set({
      uid: '789',
      email: 'logged@example.com',
      displayName: 'Logged User',
    } as User);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logged-in-card')).toBeTruthy();
    expect(compiled.textContent).toContain('Logged User');

    mockAuthService.logout.mockResolvedValue(undefined);
    await component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
