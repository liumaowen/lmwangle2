import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycustomerbankaccountComponent } from './mycustomerbankaccount.component';

describe('MycustomerbankaccountComponent', () => {
  let component: MycustomerbankaccountComponent;
  let fixture: ComponentFixture<MycustomerbankaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycustomerbankaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycustomerbankaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
