import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ExerciseDbComponent } from './exercise-db.component';

describe('ExerciseDbComponent', () => {
  let component: ExerciseDbComponent;
  let fixture: ComponentFixture<ExerciseDbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseDbComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseDbComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
