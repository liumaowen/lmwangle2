import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XstuihuoComponent } from './xstuihuo.component';

describe('XstuihuoComponent', () => {
  let component: XstuihuoComponent;
  let fixture: ComponentFixture<XstuihuoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XstuihuoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XstuihuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
