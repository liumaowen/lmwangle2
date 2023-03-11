import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cgwanglai2Component } from './cgwanglai2.component';

describe('Cgwanglai2Component', () => {
  let component: Cgwanglai2Component;
  let fixture: ComponentFixture<Cgwanglai2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cgwanglai2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cgwanglai2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
