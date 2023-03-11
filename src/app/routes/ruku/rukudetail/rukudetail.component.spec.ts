import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RukudetailComponent } from './rukudetail.component';

describe('RukudetailComponent', () => {
  let component: RukudetailComponent;
  let fixture: ComponentFixture<RukudetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RukudetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RukudetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
