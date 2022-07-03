import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpricelogComponent } from './bpricelog.component';

describe('BpricelogComponent', () => {
  let component: BpricelogComponent;
  let fixture: ComponentFixture<BpricelogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpricelogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpricelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
