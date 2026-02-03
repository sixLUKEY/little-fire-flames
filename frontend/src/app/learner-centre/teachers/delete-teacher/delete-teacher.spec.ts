import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTeacher } from './delete-teacher';

describe('DeleteTeacher', () => {
  let component: DeleteTeacher;
  let fixture: ComponentFixture<DeleteTeacher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTeacher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTeacher);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
