import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CginvoiceTiaohuoComponent } from './cginvoice-tiaohuo.component';

describe('CginvoiceCountComponent', () => {
  let component: CginvoiceTiaohuoComponent;
  let fixture: ComponentFixture<CginvoiceTiaohuoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CginvoiceTiaohuoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CginvoiceTiaohuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
