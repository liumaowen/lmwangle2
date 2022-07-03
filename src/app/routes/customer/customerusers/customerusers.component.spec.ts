import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerusersComponent } from './customerusers.component';

describe('CustomerusersComponent', () => {
  let component: CustomerusersComponent;
  let fixture: ComponentFixture<CustomerusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
