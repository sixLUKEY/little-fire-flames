import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubject } from './update-subject';

describe('UpdateSubject', () => {
  let component: UpdateSubject;
  let fixture: ComponentFixture<UpdateSubject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSubject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSubject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
