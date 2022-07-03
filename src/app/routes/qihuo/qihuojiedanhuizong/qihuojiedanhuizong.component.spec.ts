/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QihuojiedanhuizongComponent } from './qihuojiedanhuizong.component';

describe('QihuojiedanhuizongComponent', () => {
  let component: QihuojiedanhuizongComponent;
  let fixture: ComponentFixture<QihuojiedanhuizongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QihuojiedanhuizongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QihuojiedanhuizongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
