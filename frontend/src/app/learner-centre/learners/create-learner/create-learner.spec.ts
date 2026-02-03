import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLearner } from './create-learner';

describe('CreateLearner', () => {
  let component: CreateLearner;
  let fixture: ComponentFixture<CreateLearner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLearner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLearner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
