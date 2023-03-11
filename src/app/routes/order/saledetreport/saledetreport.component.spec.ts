import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaledetreportComponent } from './saledetreport.component';

describe('SaledetreportComponent', () => {
  let component: SaledetreportComponent;
  let fixture: ComponentFixture<SaledetreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaledetreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaledetreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
