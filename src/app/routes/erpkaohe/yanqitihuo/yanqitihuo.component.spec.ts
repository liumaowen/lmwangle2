/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { YanqitihuoComponent } from './yanqitihuo.component';

describe('YanqitihuoComponent', () => {
  let component: YanqitihuoComponent;
  let fixture: ComponentFixture<YanqitihuoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YanqitihuoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YanqitihuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
