import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeraddressComponent } from './customeraddress.component';

describe('CustomeraddressComponent', () => {
  let component: CustomeraddressComponent;
  let fixture: ComponentFixture<CustomeraddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomeraddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeraddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
