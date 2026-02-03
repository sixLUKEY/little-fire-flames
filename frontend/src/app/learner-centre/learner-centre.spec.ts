import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerCentre } from './learner-centre';

describe('LearnerCentre', () => {
  let component: LearnerCentre;
  let fixture: ComponentFixture<LearnerCentre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnerCentre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnerCentre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
