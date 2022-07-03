/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LirunjixiaoComponent } from './lirunjixiao.component';

describe('LirunjixiaoComponent', () => {
  let component: LirunjixiaoComponent;
  let fixture: ComponentFixture<LirunjixiaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LirunjixiaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LirunjixiaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
