import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import { NotificationService } from './notification.service';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let service: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
      providers: [NotificationService],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  afterEach(() => {
    service.clearAll();
  });

  it('should create NotificationComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should not render notification container when there are no notifications', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.notification-container')).toBeNull();
  });

  it('should render notification items with message and correct error class', () => {
    service.showError('Błąd autoryzacji 401');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const item = compiled.querySelector('.notification-item');
    expect(item).toBeTruthy();
    expect(item?.classList.contains('notification-error')).toBe(true);
    expect(compiled.querySelector('.notification-message')?.textContent).toContain(
      'Błąd autoryzacji 401'
    );
  });

  it('should trigger action callback and dismiss when action button is clicked', () => {
    const actionSpy = vi.fn();
    service.showError('Błąd 401', {
      label: 'Zaloguj ponownie',
      callback: actionSpy,
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const actionBtn = compiled.querySelector<HTMLButtonElement>('.btn-notification-action');
    expect(actionBtn).toBeTruthy();
    expect(actionBtn?.textContent?.trim()).toBe('Zaloguj ponownie');

    actionBtn?.click();
    fixture.detectChanges();

    expect(actionSpy).toHaveBeenCalled();
    expect(service.notifications().length).toBe(0);
  });

  it('should dismiss notification when close button is clicked', () => {
    service.showError('Do usunięcia');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const closeBtn = compiled.querySelector<HTMLButtonElement>('.btn-notification-close');
    expect(closeBtn).toBeTruthy();

    closeBtn?.click();
    fixture.detectChanges();

    expect(service.notifications().length).toBe(0);
  });
});
