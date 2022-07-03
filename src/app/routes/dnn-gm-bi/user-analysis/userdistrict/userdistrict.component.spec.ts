import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdistrictComponent } from './userdistrict.component';

describe('UserdistrictComponent', () => {
  let component: UserdistrictComponent;
  let fixture: ComponentFixture<UserdistrictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserdistrictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserdistrictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
