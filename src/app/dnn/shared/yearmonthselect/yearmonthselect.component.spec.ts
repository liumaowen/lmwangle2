import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearmonthselectComponent } from './yearmonthselect.component';

describe('YearmonthselectComponent', () => {
  let component: YearmonthselectComponent;
  let fixture: ComponentFixture<YearmonthselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearmonthselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearmonthselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
