import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserreceiptComponent } from './userreceipt.component';

describe('UserreceiptComponent', () => {
  let component: UserreceiptComponent;
  let fixture: ComponentFixture<UserreceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserreceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserreceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
