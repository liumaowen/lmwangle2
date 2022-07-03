import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CgbuchadetreportComponent } from './cgbuchadetreport.component';

describe('CgbuchadetreportComponent', () => {
  let component: CgbuchadetreportComponent;
  let fixture: ComponentFixture<CgbuchadetreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CgbuchadetreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CgbuchadetreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
