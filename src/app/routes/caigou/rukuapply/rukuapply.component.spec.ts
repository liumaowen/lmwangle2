import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaigouComponent } from './caigou.component';

describe('CaigouComponent', () => {
  let component: CaigouComponent;
  let fixture: ComponentFixture<CaigouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaigouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaigouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
