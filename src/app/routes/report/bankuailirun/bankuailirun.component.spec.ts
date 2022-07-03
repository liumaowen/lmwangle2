import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankuailirunComponent } from './bankuailirun.component';

describe('SaledetreportComponent', () => {
  let component: BankuailirunComponent;
  let fixture: ComponentFixture<BankuailirunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankuailirunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankuailirunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
