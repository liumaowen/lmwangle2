import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersalemanComponent } from './usersaleman.component';

describe('UsersalemanComponent', () => {
  let component: UsersalemanComponent;
  let fixture: ComponentFixture<UsersalemanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersalemanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersalemanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
