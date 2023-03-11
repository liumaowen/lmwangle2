import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotdetailComponent } from './allotdetail.component';

describe('AllotdetailComponent', () => {
  let component: AllotdetailComponent;
  let fixture: ComponentFixture<AllotdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllotdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
