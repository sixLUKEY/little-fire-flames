import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLearner } from './delete-learner';

describe('DeleteLearner', () => {
  let component: DeleteLearner;
  let fixture: ComponentFixture<DeleteLearner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteLearner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteLearner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
