import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XstuihuodetailComponent } from './xstuihuodetail.component';

describe('XstuihuodetailComponent', () => {
  let component: XstuihuodetailComponent;
  let fixture: ComponentFixture<XstuihuodetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XstuihuodetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XstuihuodetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
