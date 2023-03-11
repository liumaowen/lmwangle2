import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProorderdetailComponent } from './proorderdetail.component';

describe('ProorderdetailComponent', () => {
  let component: ProorderdetailComponent;
  let fixture: ComponentFixture<ProorderdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProorderdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProorderdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
