import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { HevyImportComponent } from './hevy-import.component';
import { HevyImportService } from './hevy-import.service';
import { HevyImportResponse } from './models/hevy-import';

describe('HevyImportComponent', () => {
  let component: HevyImportComponent;
  let fixture: ComponentFixture<HevyImportComponent>;
  let hevyImportService: HevyImportService;

  const mockSuccessResponse: HevyImportResponse = {
    totalFetched: 15,
    workoutsImported: 12,
    workoutsSkipped: 3,
    exercisesCreated: 5,
    message: 'Import completed successfully: 12 workouts imported.',
    importedTitles: ['Leg Day', 'Push Day', 'Pull Day'],
  };

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [HevyImportComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HevyImportComponent);
    component = fixture.componentInstance;
    hevyImportService = TestBed.inject(HevyImportService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load saved token from localStorage on init if present', () => {
    localStorage.setItem('pt_hevy_access_token', 'saved-test-token');
    component.ngOnInit();

    expect(component.accessToken).toBe('saved-test-token');
    expect(component.rememberToken()).toBe(true);
  });

  it('should toggle showToken signal', () => {
    expect(component.showToken()).toBe(false);
    component.toggleShowToken();
    expect(component.showToken()).toBe(true);
    component.toggleShowToken();
    expect(component.showToken()).toBe(false);
  });

  it('should call importFromHevy with token and render results on success', () => {
    const importSpy = vi
      .spyOn(hevyImportService, 'importFromHevy')
      .mockReturnValue(of(mockSuccessResponse));

    component.accessToken = 'my-secret-token';
    component.rememberToken.set(true);

    component.onImport();

    expect(importSpy).toHaveBeenCalledWith({ 'access-token': 'my-secret-token' });
    expect(localStorage.getItem('pt_hevy_access_token')).toBe('my-secret-token');
    expect(component.isLoading()).toBe(false);
    expect(component.result()).toEqual(mockSuccessResponse);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.result-card')).toBeTruthy();
    expect(compiled.textContent).toContain('Import completed successfully: 12 workouts imported.');
    expect(compiled.textContent).toContain('12');
    expect(compiled.textContent).toContain('Workouts Imported');
    expect(compiled.textContent).toContain('Leg Day');
    expect(compiled.textContent).toContain('Push Day');
    expect(compiled.textContent).toContain('Pull Day');
  });

  it('should remove token from localStorage if rememberToken is false', () => {
    localStorage.setItem('pt_hevy_access_token', 'old-token');
    vi.spyOn(hevyImportService, 'importFromHevy').mockReturnValue(of(mockSuccessResponse));

    component.accessToken = 'new-token';
    component.rememberToken.set(false);

    component.onImport();

    expect(localStorage.getItem('pt_hevy_access_token')).toBeNull();
  });

  it('should call importFromHevy with undefined when token is empty', () => {
    const importSpy = vi
      .spyOn(hevyImportService, 'importFromHevy')
      .mockReturnValue(of(mockSuccessResponse));

    component.accessToken = '   ';
    component.onImport();

    expect(importSpy).toHaveBeenCalledWith(undefined);
  });

  it('should display error message if importFromHevy fails', () => {
    vi.spyOn(hevyImportService, 'importFromHevy').mockReturnValue(
      throwError(() => ({
        error: { message: 'Invalid Hevy access token' },
      }))
    );

    component.accessToken = 'bad-token';
    component.onImport();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Invalid Hevy access token');
    expect(component.result()).toBeNull();

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-box')).toBeTruthy();
    expect(compiled.textContent).toContain('Invalid Hevy access token');
  });

  it('should clear results and error message on clearResults()', () => {
    component.result.set(mockSuccessResponse);
    component.errorMessage.set('Some error');

    component.clearResults();

    expect(component.result()).toBeNull();
    expect(component.errorMessage()).toBeNull();
  });
});
