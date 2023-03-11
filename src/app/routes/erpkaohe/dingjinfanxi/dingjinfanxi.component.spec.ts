/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DingjinfanxiComponent } from './dingjinfanxi.component';

describe('DingjinfanxiComponent', () => {
  let component: DingjinfanxiComponent;
  let fixture: ComponentFixture<DingjinfanxiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DingjinfanxiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DingjinfanxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
