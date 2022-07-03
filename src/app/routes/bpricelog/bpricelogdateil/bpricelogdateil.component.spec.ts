import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpricelogdateilComponent } from './bpricelogdateil.component';

describe('BpricelogdateilComponent', () => {
  let component: BpricelogdateilComponent;
  let fixture: ComponentFixture<BpricelogdateilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpricelogdateilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpricelogdateilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
