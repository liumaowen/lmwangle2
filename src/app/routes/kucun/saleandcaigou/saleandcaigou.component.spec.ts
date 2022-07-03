import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleandcaigouComponent } from './saleandcaigou.component';

describe('SaleandcaigouComponent', () => {
  let component: SaleandcaigouComponent;
  let fixture: ComponentFixture<SaleandcaigouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleandcaigouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleandcaigouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
