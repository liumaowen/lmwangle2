import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponlistComponent } from './couponlist.component';

describe('CouponlistComponent', () => {
  let component: CouponlistComponent;
  let fixture: ComponentFixture<CouponlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
