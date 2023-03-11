import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XsbuchaimportComponent } from './xsbuchaimport.component';

describe('XsbuchaimportComponent', () => {
  let component: XsbuchaimportComponent;
  let fixture: ComponentFixture<XsbuchaimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XsbuchaimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XsbuchaimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
