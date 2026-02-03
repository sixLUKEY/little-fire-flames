import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSubject } from './delete-subject';

describe('DeleteSubject', () => {
  let component: DeleteSubject;
  let fixture: ComponentFixture<DeleteSubject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSubject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSubject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
