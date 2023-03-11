import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WuliuclassifyComponent } from './wuliuclassify.component';

describe('ClassifyComponent', () => {
  let component: WuliuclassifyComponent;
  let fixture: ComponentFixture<WuliuclassifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WuliuclassifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WuliuclassifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
