import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerreportComponent } from './customerreport.component';

describe('CustomerreportComponent', () => {
  let component: CustomerreportComponent;
  let fixture: ComponentFixture<CustomerreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
