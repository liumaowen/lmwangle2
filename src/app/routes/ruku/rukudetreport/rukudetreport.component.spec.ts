import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RukudetreportComponent } from './rukudetreport.component';

describe('RukudetreportComponent', () => {
  let component: RukudetreportComponent;
  let fixture: ComponentFixture<RukudetreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RukudetreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RukudetreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
