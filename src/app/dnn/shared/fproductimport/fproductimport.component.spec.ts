import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FproductimportComponent } from './fproductimport.component';

describe('FproductimportComponent', () => {
  let component: FproductimportComponent;
  let fixture: ComponentFixture<FproductimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FproductimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FproductimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
