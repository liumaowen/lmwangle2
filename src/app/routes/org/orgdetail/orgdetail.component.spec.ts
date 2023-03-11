import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgdetailComponent } from './orgdetail.component';

describe('OrgdetailComponent', () => {
  let component: OrgdetailComponent;
  let fixture: ComponentFixture<OrgdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
