import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporterbpriceComponent } from './reporterbprice.component';

describe('ReporterbpriceComponent', () => {
  let component: ReporterbpriceComponent;
  let fixture: ComponentFixture<ReporterbpriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporterbpriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporterbpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
