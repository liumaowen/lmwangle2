import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CginvoicedetailComponent } from './cginvoicedetail.component';

describe('CginvoicedetailComponent', () => {
  let component: CginvoicedetailComponent;
  let fixture: ComponentFixture<CginvoicedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CginvoicedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CginvoicedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
