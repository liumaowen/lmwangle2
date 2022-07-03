import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XiaoshouwanglaireportComponent } from './xiaoshouwanglaireport.component';

describe('XiaoshouwanglaireportComponent', () => {
  let component: XiaoshouwanglaireportComponent;
  let fixture: ComponentFixture<XiaoshouwanglaireportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XiaoshouwanglaireportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XiaoshouwanglaireportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
