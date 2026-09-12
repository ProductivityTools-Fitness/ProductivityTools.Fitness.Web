import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    service.clearAll();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.notifications()).toEqual([]);
  });

  it('should add an error notification with showError', () => {
    const actionCallback = vi.fn();
    const id = service.showError('Błąd autoryzacji 401', {
      label: 'Zaloguj',
      callback: actionCallback,
    });

    const notifs = service.notifications();
    expect(notifs.length).toBe(1);
    expect(notifs[0].id).toBe(id);
    expect(notifs[0].message).toBe('Błąd autoryzacji 401');
    expect(notifs[0].type).toBe('error');
    expect(notifs[0].action?.label).toBe('Zaloguj');
  });

  it('should auto-dismiss notification after specified duration', () => {
    service.showError('Tymczasowy błąd', undefined, 3000);
    expect(service.notifications().length).toBe(1);

    vi.advanceTimersByTime(2999);
    expect(service.notifications().length).toBe(1);

    vi.advanceTimersByTime(1);
    expect(service.notifications().length).toBe(0);
  });

  it('should manually dismiss notification by id', () => {
    const id = service.showInfo('Wiadomość informacyjna');
    expect(service.notifications().length).toBe(1);

    service.dismiss(id);
    expect(service.notifications().length).toBe(0);
  });

  it('should clear all notifications', () => {
    service.showError('Błąd 1');
    service.showWarning('Ostrzeżenie 2');
    service.showSuccess('Sukces 3');
    expect(service.notifications().length).toBe(3);

    service.clearAll();
    expect(service.notifications().length).toBe(0);
  });

  it('should not duplicate identical notifications', () => {
    const id1 = service.showError('Ta sama wiadomość');
    const id2 = service.showError('Ta sama wiadomość');

    expect(id1).toBe(id2);
    expect(service.notifications().length).toBe(1);
  });

  it('should support showWarning, showSuccess, and showInfo helper methods', () => {
    service.showWarning('Ostrzeżenie');
    service.showSuccess('Sukces');
    service.showInfo('Informacja');

    const notifs = service.notifications();
    expect(notifs.length).toBe(3);
    expect(notifs[0].type).toBe('warning');
    expect(notifs[1].type).toBe('success');
    expect(notifs[2].type).toBe('info');
  });
});
