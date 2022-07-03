import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailypriceComponent } from './dailyprice.component';

describe('DailypriceComponent', () => {
  let component: DailypriceComponent;
  let fixture: ComponentFixture<DailypriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailypriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailypriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
