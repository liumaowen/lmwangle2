import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XsbuchaComponent } from './xsbucha.component';

describe('XsbuchaComponent', () => {
  let component: XsbuchaComponent;
  let fixture: ComponentFixture<XsbuchaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XsbuchaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XsbuchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
