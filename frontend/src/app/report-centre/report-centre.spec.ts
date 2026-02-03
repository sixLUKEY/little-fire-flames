import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCentre } from './report-centre';

describe('ReportCentre', () => {
  let component: ReportCentre;
  let fixture: ComponentFixture<ReportCentre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCentre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportCentre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
