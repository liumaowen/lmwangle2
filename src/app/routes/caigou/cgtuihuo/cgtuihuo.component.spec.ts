import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CgtuihuoComponent } from './cgtuihuo.component';

describe('CgtuihuoComponent', () => {
  let component: CgtuihuoComponent;
  let fixture: ComponentFixture<CgtuihuoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CgtuihuoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CgtuihuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
