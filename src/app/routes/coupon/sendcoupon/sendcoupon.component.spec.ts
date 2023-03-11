import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendcouponComponent } from './sendcoupon.component';

describe('SendcouponComponent', () => {
  let component: SendcouponComponent;
  let fixture: ComponentFixture<SendcouponComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendcouponComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendcouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
