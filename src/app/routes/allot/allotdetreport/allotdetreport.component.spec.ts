import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotdetreportComponent } from './allotdetreport.component';

describe('AllotdetreportComponent', () => {
  let component: AllotdetreportComponent;
  let fixture: ComponentFixture<AllotdetreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllotdetreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotdetreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
