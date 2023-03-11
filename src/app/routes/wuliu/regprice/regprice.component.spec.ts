import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegpriceComponent } from './regprice.component';

describe(' RegpriceComponent', () => {
  let component:  RegpriceComponent;
  let fixture: ComponentFixture< RegpriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  RegpriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( RegpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
