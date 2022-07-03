/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HtexecuteComponent } from './htexecute.component';

describe('HtexecuteComponent', () => {
  let component: HtexecuteComponent;
  let fixture: ComponentFixture<HtexecuteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtexecuteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtexecuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
