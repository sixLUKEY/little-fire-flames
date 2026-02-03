import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Learners } from './learners';

describe('Learners', () => {
  let component: Learners;
  let fixture: ComponentFixture<Learners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Learners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Learners);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
