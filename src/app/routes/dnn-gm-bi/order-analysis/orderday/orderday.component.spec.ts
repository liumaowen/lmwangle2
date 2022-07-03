import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderdayComponent } from './orderday.component';

describe('OrderdayComponent', () => {
  let component: OrderdayComponent;
  let fixture: ComponentFixture<OrderdayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderdayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
