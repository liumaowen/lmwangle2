import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessorderdetailComponent } from './businessorderdetail.component';

describe('BusinessorderdetailComponent', () => {
  let component: BusinessorderdetailComponent;
  let fixture: ComponentFixture<BusinessorderdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessorderdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessorderdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
