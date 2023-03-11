import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountregisterComponent } from './discountregister.component';

describe('DiscountregisterComponent', () => {
  let component: DiscountregisterComponent;
  let fixture: ComponentFixture<DiscountregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
