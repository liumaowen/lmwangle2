/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QihuoexecuteComponent } from './qihuoexecute.component';

describe('QihuoexecuteComponent', () => {
  let component: QihuoexecuteComponent;
  let fixture: ComponentFixture<QihuoexecuteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QihuoexecuteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QihuoexecuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
