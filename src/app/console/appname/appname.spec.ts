import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Appname } from './appname';

describe('Appname', () => {
  let component: Appname;
  let fixture: ComponentFixture<Appname>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Appname],
    }).compileComponents();

    fixture = TestBed.createComponent(Appname);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
