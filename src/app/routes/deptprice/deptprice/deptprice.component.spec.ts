import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptpriceComponent } from './deptprice.component';

describe('DeptpriceComponent', () => {
  let component: DeptpriceComponent;
  let fixture: ComponentFixture<DeptpriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeptpriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
