import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WuliuclassifydetailComponent } from './wuliuclassifydetail.component';

describe('ClassifydetailComponent', () => {
  let component: WuliuclassifydetailComponent;
  let fixture: ComponentFixture<WuliuclassifydetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WuliuclassifydetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WuliuclassifydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
