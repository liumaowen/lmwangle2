import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CgfukuanplanComponent } from './cgfukuanplan.component';

describe('JinhuoguanzhiComponent', () => {
  let component: CgfukuanplanComponent;
  let fixture: ComponentFixture<CgfukuanplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CgfukuanplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CgfukuanplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
