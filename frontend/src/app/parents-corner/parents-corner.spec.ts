import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentsCorner } from './parents-corner';

describe('ParentsCorner', () => {
  let component: ParentsCorner;
  let fixture: ComponentFixture<ParentsCorner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentsCorner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentsCorner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
