import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermonthComponent } from './usermonth.component';

describe('UsermonthComponent', () => {
  let component: UsermonthComponent;
  let fixture: ComponentFixture<UsermonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsermonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsermonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
