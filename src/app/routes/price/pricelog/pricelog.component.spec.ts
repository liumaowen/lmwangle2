import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricelogComponent } from './pricelog.component';

describe('PricelogComponent', () => {
  let component: PricelogComponent;
  let fixture: ComponentFixture<PricelogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricelogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
