import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalebilldetreportComponent } from './salebilldetreport.component';

describe('SalebilldetreportComponent', () => {
  let component: SalebilldetreportComponent;
  let fixture: ComponentFixture<SalebilldetreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalebilldetreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalebilldetreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
