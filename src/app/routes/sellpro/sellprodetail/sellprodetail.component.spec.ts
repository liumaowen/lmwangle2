import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellprodetailComponent } from './sellprodetail.component';

describe('SellprodetailComponent', () => {
  let component: SellprodetailComponent;
  let fixture: ComponentFixture<SellprodetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellprodetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellprodetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
