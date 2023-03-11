import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeshumaoliComponent } from './teshumaoli.component';

describe('SaledetreportComponent', () => {
  let component: TeshumaoliComponent;
  let fixture: ComponentFixture<TeshumaoliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeshumaoliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeshumaoliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
