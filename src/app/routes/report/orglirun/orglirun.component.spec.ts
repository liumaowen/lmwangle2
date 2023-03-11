import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrglirunComponent } from './orglirun.component';

describe('SaledetreportComponent', () => {
  let component: OrglirunComponent;
  let fixture: ComponentFixture<OrglirunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrglirunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrglirunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
