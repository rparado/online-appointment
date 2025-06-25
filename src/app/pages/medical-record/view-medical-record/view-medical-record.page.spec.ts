import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewMedicalRecordPage } from './view-medical-record.page';

describe('ViewMedicalRecordPage', () => {
  let component: ViewMedicalRecordPage;
  let fixture: ComponentFixture<ViewMedicalRecordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMedicalRecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
