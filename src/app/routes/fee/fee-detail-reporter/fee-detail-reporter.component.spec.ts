import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDetailReporterComponent } from './fee-detail-reporter.component';

describe('FeeDetailReporterComponent', () => {
  let component: FeeDetailReporterComponent;
  let fixture: ComponentFixture<FeeDetailReporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeDetailReporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDetailReporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
