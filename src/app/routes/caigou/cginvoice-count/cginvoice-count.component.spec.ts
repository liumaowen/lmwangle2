import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CginvoiceCountComponent } from './cginvoice-count.component';

describe('CginvoiceCountComponent', () => {
  let component: CginvoiceCountComponent;
  let fixture: ComponentFixture<CginvoiceCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CginvoiceCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CginvoiceCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
