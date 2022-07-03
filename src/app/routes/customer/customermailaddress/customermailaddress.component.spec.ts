import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomermailaddressComponent } from './customermailaddress.component';

describe('CustomermailaddressComponent', () => {
  let component: CustomermailaddressComponent;
  let fixture: ComponentFixture<CustomermailaddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomermailaddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomermailaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
