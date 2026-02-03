import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTeacher } from './update-teacher';

describe('UpdateTeacher', () => {
  let component: UpdateTeacher;
  let fixture: ComponentFixture<UpdateTeacher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTeacher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTeacher);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
