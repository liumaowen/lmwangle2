import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerchaoqiimportComponent } from './customerchaoqiimport.component';

describe('CustomerreportComponent', () => {
  let component: CustomerchaoqiimportComponent;
  let fixture: ComponentFixture<CustomerchaoqiimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerchaoqiimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerchaoqiimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
