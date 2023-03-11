import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellproComponent } from './sellpro.component';

describe('SellproComponent', () => {
  let component: SellproComponent;
  let fixture: ComponentFixture<SellproComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellproComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
