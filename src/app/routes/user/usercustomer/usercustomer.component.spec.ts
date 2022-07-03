import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercustomerComponent } from './usercustomer.component';

describe('UsercustomerComponent', () => {
  let component: UsercustomerComponent;
  let fixture: ComponentFixture<UsercustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsercustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsercustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
