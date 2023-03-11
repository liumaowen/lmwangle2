import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WiskcompanysearchComponent } from './wiskcompanysearch.component';

describe('WiskcompanysearchComponent', () => {
  let component: WiskcompanysearchComponent;
  let fixture: ComponentFixture<WiskcompanysearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiskcompanysearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiskcompanysearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
