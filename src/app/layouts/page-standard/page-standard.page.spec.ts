import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageStandardPage } from './page-standard.page';

describe('PageStandardPage', () => {
  let component: PageStandardPage;
  let fixture: ComponentFixture<PageStandardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageStandardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
