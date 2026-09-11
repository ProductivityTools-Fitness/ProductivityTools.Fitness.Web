import { TestBed } from '@angular/core/testing';
import { User } from 'firebase/auth';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial unauthenticated state or reflect current user', () => {
    expect(typeof service.isLoggedIn()).toBe('boolean');
    expect(typeof service.isLoading()).toBe('boolean');
  });

  it('should compute displayName and userEmail when user is set', () => {
    const fakeUser = {
      uid: 'u1',
      email: 'john@example.com',
      displayName: 'John Doe',
      photoURL: 'https://example.com/avatar.jpg',
      getIdToken: vi.fn().mockResolvedValue('token-123'),
    } as unknown as User;

    service.currentUser.set(fakeUser);

    expect(service.isLoggedIn()).toBe(true);
    expect(service.userEmail()).toBe('john@example.com');
    expect(service.displayName()).toBe('John Doe');
    expect(service.photoURL()).toBe('https://example.com/avatar.jpg');
  });

  it('should return email as displayName when displayName is missing', () => {
    const fakeUser = {
      uid: 'u2',
      email: 'noname@example.com',
      displayName: null,
      photoURL: null,
    } as unknown as User;

    service.currentUser.set(fakeUser);

    expect(service.displayName()).toBe('noname@example.com');
  });

  it('should return idToken when user exists', async () => {
    const getIdTokenSpy = vi.fn().mockResolvedValue('jwt-token-xyz');
    const fakeUser = {
      uid: 'u3',
      email: 'tokenuser@example.com',
      getIdToken: getIdTokenSpy,
    } as unknown as User;

    service.currentUser.set(fakeUser);

    const token = await service.getIdToken();
    expect(token).toBe('jwt-token-xyz');
    expect(getIdTokenSpy).toHaveBeenCalledWith(false);
  });

  it('should return null idToken when no user is logged in', async () => {
    service.currentUser.set(null);
    const token = await service.getIdToken();
    expect(token).toBeNull();
  });
});
