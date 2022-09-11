import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderlirunComponent } from './orderlirun.component';

describe('OrderlirunComponent', () => {
  let component: OrderlirunComponent;
  let fixture: ComponentFixture<OrderlirunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderlirunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderlirunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
