/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FeejixiaoComponent } from './feejixiao.component';

describe('FeejixiaoComponent', () => {
  let component: FeejixiaoComponent;
  let fixture: ComponentFixture<FeejixiaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeejixiaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeejixiaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
