import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierReportComponent } from './courier-report.component';

describe('CourierReportComponent', () => {
  let component: CourierReportComponent;
  let fixture: ComponentFixture<CourierReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
