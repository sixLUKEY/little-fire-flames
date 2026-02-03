import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateClass } from './update-class';

describe('UpdateClass', () => {
  let component: UpdateClass;
  let fixture: ComponentFixture<UpdateClass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateClass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateClass);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
