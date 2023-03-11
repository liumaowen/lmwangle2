import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdraftreportComponent } from './overdraftreport.component';

describe('OverdraftreportComponent', () => {
  let component: OverdraftreportComponent;
  let fixture: ComponentFixture<OverdraftreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdraftreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdraftreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
