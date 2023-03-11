import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricelogdateilComponent } from './pricelogdateil.component';

describe('PricelogdateilComponent', () => {
  let component: PricelogdateilComponent;
  let fixture: ComponentFixture<PricelogdateilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricelogdateilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricelogdateilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
