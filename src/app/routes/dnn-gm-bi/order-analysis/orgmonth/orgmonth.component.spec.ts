import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgmonthComponent } from './orgmonth.component';

describe('OrgmonthComponent', () => {
  let component: OrgmonthComponent;
  let fixture: ComponentFixture<OrgmonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgmonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgmonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
