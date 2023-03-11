import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderdetreportComponent } from './orderdetreport.component';

describe('OrderdetreportComponent', () => {
  let component: OrderdetreportComponent;
  let fixture: ComponentFixture<OrderdetreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderdetreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderdetreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
