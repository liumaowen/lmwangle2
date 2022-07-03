import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CgtuihuodetComponent } from './cgtuihuodet.component';

describe('CgtuihuodetComponent', () => {
  let component: CgtuihuodetComponent;
  let fixture: ComponentFixture<CgtuihuodetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CgtuihuodetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CgtuihuodetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
