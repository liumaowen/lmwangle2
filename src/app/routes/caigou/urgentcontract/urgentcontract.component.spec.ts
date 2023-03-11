import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentcontractComponent } from './urgentcontract.component';

describe('UrgentcontractComponent', () => {
  let component: UrgentcontractComponent;
  let fixture: ComponentFixture<UrgentcontractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrgentcontractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgentcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
