import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CginvoicedetComponent } from './cginvoicedet.component';

describe('CginvoicedetComponent', () => {
  let component: CginvoicedetComponent;
  let fixture: ComponentFixture<CginvoicedetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CginvoicedetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CginvoicedetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
