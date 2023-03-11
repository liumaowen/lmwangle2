/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { YunpricecankaoComponent } from './yunpricecankao.component';

describe('YunpricecankaoComponent', () => {
  let component: YunpricecankaoComponent;
  let fixture: ComponentFixture<YunpricecankaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YunpricecankaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YunpricecankaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
