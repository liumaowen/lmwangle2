import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CginvoiceingComponent } from './cginvoiceing.component';

describe('CginvoiceingComponent', () => {
  let component: CginvoiceingComponent;
  let fixture: ComponentFixture<CginvoiceingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CginvoiceingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CginvoiceingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
