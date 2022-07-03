import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksmsComponent } from './banksms.component';

describe('BanksmsComponent', () => {
  let component: BanksmsComponent;
  let fixture: ComponentFixture<BanksmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanksmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanksmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
