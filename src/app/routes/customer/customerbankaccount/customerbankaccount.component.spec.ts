import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerbankaccountComponent } from './customerbankaccount.component';

describe('CustomerbankaccountComponent', () => {
  let component: CustomerbankaccountComponent;
  let fixture: ComponentFixture<CustomerbankaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerbankaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerbankaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
