import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteClass } from './delete-class';

describe('DeleteClass', () => {
  let component: DeleteClass;
  let fixture: ComponentFixture<DeleteClass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteClass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteClass);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
