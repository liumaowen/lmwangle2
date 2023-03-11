import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdercalcComponent } from './ordercalc.component';

describe('OrdercalcComponent', () => {
  let component: OrdercalcComponent;
  let fixture: ComponentFixture<OrdercalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdercalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdercalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
