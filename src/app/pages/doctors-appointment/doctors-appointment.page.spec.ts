import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorsAppointmentPage } from './doctors-appointment.page';

describe('DoctorsAppointmentPage', () => {
  let component: DoctorsAppointmentPage;
  let fixture: ComponentFixture<DoctorsAppointmentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsAppointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
