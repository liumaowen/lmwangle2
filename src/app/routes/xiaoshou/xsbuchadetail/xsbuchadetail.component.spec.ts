import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XsbuchadetailComponent } from './xsbuchadetail.component';

describe('XsbuchadetailComponent', () => {
  let component: XsbuchadetailComponent;
  let fixture: ComponentFixture<XsbuchadetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XsbuchadetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XsbuchadetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
