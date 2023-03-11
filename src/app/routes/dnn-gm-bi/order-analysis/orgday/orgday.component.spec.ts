import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgdayComponent } from './orgday.component';

describe('OrgdayComponent', () => {
  let component: OrgdayComponent;
  let fixture: ComponentFixture<OrgdayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgdayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
