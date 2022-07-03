/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JiagongmsgComponent } from './jiagongmsg.component';

describe('JiagongmsgComponent', () => {
  let component: JiagongmsgComponent;
  let fixture: ComponentFixture<JiagongmsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JiagongmsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JiagongmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
