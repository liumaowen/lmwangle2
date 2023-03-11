import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserprojectComponent } from './userproject.component';

describe('UserprojectComponent', () => {
  let component: UserprojectComponent;
  let fixture: ComponentFixture<UserprojectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserprojectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
