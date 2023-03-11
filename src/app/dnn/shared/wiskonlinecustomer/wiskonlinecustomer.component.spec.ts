import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WiskonlinecustomerComponent } from './wiskonlinecustomer.component';

describe('WiskonlinecustomerComponent', () => {
  let component: WiskonlinecustomerComponent;
  let fixture: ComponentFixture<WiskonlinecustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiskonlinecustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiskonlinecustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
