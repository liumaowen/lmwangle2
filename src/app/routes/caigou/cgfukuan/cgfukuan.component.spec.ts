import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CgfukuanComponent } from './cgfukuan.component';

describe('CgfukuanComponent', () => {
  let component: CgfukuanComponent;
  let fixture: ComponentFixture<CgfukuanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CgfukuanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CgfukuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
