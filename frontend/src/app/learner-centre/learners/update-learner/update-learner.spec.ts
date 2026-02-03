import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLearner } from './update-learner';

describe('UpdateLearner', () => {
  let component: UpdateLearner;
  let fixture: ComponentFixture<UpdateLearner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateLearner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateLearner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
