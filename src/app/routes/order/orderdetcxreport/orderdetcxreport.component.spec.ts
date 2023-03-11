import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderdetcxreportComponent } from './orderdetcxreport.component';

describe('OrderdetcxreportComponent', () => {
  let component: OrderdetcxreportComponent;
  let fixture: ComponentFixture<OrderdetcxreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderdetcxreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderdetcxreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
