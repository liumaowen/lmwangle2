import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerdetailComponent } from './customerdetail.component';

describe('CustomerdetailComponent', () => {
  let component: CustomerdetailComponent;
  let fixture: ComponentFixture<CustomerdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
