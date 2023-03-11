/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TiaohuofanxiComponent } from './tiaohuofanxi.component';

describe('DingjinfanxiComponent', () => {
  let component: TiaohuofanxiComponent;
  let fixture: ComponentFixture<TiaohuofanxiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiaohuofanxiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiaohuofanxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
