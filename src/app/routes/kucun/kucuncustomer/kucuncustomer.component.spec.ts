import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {  KucuncustomerComponent } from './kucuncustomer.component';

describe('KucuncustomerComponent', () => {
  let component: KucuncustomerComponent;
  let fixture: ComponentFixture<KucuncustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KucuncustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KucuncustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
