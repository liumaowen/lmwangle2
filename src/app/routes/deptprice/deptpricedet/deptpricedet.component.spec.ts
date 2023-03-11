import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptpricedetComponent } from './deptpricedet.component';

describe('DeptpricedetComponent', () => {
  let component: DeptpricedetComponent;
  let fixture: ComponentFixture<DeptpricedetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeptpricedetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptpricedetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
