import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaydealdetailComponent } from './daydealdetail.component';

describe('SaledetreportComponent', () => {
  let component: DaydealdetailComponent;
  let fixture: ComponentFixture<DaydealdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaydealdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaydealdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
