import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AppnameComponent } from './appname.component';

describe('AppnameComponent', () => {
  let component: AppnameComponent;
  let fixture: ComponentFixture<AppnameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppnameComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();


    fixture = TestBed.createComponent(AppnameComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

