import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpriceComponent } from './bprice.component';

describe('BpriceComponent', () => {
  let component: BpriceComponent;
  let fixture: ComponentFixture<BpriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
