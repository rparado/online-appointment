import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorsSchedulePage } from './doctors-schedule.page';

describe('DoctorsSchedulePage', () => {
  let component: DoctorsSchedulePage;
  let fixture: ComponentFixture<DoctorsSchedulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
