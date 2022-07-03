import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycustomeraddressComponent } from './mycustomeraddress.component';

describe('MycustomeraddressComponent', () => {
  let component: MycustomeraddressComponent;
  let fixture: ComponentFixture<MycustomeraddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycustomeraddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycustomeraddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
