/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChengbenComponent } from './chengben.component';

describe('ChengbenComponent', () => {
  let component: ChengbenComponent;
  let fixture: ComponentFixture<ChengbenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChengbenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChengbenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
