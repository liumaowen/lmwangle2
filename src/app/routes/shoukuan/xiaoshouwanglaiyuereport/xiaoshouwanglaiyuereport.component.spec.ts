import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XiaoshouwanglaiyuereportComponent } from './xiaoshouwanglaiyuereport.component';

describe('XiaoshouwanglaiyuereportComponent', () => {
  let component: XiaoshouwanglaiyuereportComponent;
  let fixture: ComponentFixture<XiaoshouwanglaiyuereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XiaoshouwanglaiyuereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XiaoshouwanglaiyuereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
