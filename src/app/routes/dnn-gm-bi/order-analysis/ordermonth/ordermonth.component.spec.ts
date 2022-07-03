import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdermonthComponent } from './ordermonth.component';

describe('OrdermonthComponent', () => {
  let component: OrdermonthComponent;
  let fixture: ComponentFixture<OrdermonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdermonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdermonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
