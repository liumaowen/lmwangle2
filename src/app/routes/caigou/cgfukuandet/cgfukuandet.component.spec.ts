import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CgfukuandetComponent } from './cgfukuandet.component';

describe('CgfukuandetComponent', () => {
  let component: CgfukuandetComponent;
  let fixture: ComponentFixture<CgfukuandetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CgfukuandetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CgfukuandetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
