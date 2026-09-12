import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { WorkoutListComponent } from './workout-list.component';

describe('WorkoutListComponent', () => {
  let component: WorkoutListComponent;
  let fixture: ComponentFixture<WorkoutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutListComponent],
      providers: [
        provideRouter([{ path: '**', component: WorkoutListComponent }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();


    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to workout detail when openWorkout is called with a valid id', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    component.openWorkout(42);

    expect(navigateSpy).toHaveBeenCalledWith(['/workouts/detail'], {
      queryParams: { workoutId: 42 },
    });
  });

  it('should not navigate when openWorkout is called with undefined or null', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    component.openWorkout(undefined);

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should navigate when clicking a workout row in template', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    component.workoutList.set([
      { id: 101, title: 'Morning Workout', status: 'IN_PROGRESS' },
    ]);
    fixture.detectChanges();

    const row = fixture.nativeElement.querySelector('tr.workout-row') as HTMLTableRowElement;
    expect(row).toBeTruthy();

    row.click();

    expect(navigateSpy).toHaveBeenCalledWith(['/workouts/detail'], {
      queryParams: { workoutId: 101 },
    });
  });

  it('should stop propagation when clicking the title link so row click is not triggered redundantly', async () => {
    const openWorkoutSpy = vi.spyOn(component, 'openWorkout');

    component.workoutList.set([
      { id: 101, title: 'Morning Workout', status: 'IN_PROGRESS' },
    ]);
    fixture.detectChanges();

    const titleLink = fixture.nativeElement.querySelector('.workout-title-link') as HTMLAnchorElement;
    expect(titleLink).toBeTruthy();

    titleLink.click();
    await fixture.whenStable();

    expect(openWorkoutSpy).not.toHaveBeenCalled();
  });

  it('should render default title when workout has empty title or placeholder title', () => {
    expect(component.getWorkoutTitle({ id: 5, title: '' })).toBe('Trening #5');
    expect(component.getWorkoutTitle({ id: 5, workoutNumber: 12, title: '' })).toBe('Trening #12');
    expect(component.getWorkoutTitle({ id: 6, title: 'Log Workout' })).toBe('Trening #6');
    expect(component.getWorkoutTitle({ id: 7, title: 'New workout' })).toBe('Trening #7');
    expect(component.getWorkoutTitle({ id: 8, title: 'Leg Day' })).toBe('Leg Day');
  });
});

