import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerchaoqiComponent } from './customerchaoqi.component';

describe('CustomerreportComponent', () => {
  let component: CustomerchaoqiComponent;
  let fixture: ComponentFixture<CustomerchaoqiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerchaoqiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerchaoqiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
