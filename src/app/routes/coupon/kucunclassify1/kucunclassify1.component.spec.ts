import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Kucunclassify1Component } from './kucunclassify1.component';

describe('Kucunclassify1Component', () => {
  let component: Kucunclassify1Component;
  let fixture: ComponentFixture<Kucunclassify1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Kucunclassify1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Kucunclassify1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
