import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricekucunComponent } from './pricekucun.component';

describe('PricekucunComponent', () => {
  let component: PricekucunComponent;
  let fixture: ComponentFixture<PricekucunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricekucunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricekucunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
