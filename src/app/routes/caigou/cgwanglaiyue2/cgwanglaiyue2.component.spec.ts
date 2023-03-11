import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cgwanglaiyue2Component } from './cgwanglaiyue2.component';

describe('Cgwanglaiyue2Component', () => {
  let component: Cgwanglaiyue2Component;
  let fixture: ComponentFixture<Cgwanglaiyue2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cgwanglaiyue2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cgwanglaiyue2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
