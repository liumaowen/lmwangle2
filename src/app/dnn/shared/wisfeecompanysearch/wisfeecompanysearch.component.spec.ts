import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WisfeecompanysearchComponent } from './wisfeecompanysearch.component';

describe('WisfeecompanysearchComponent', () => {
  let component: WisfeecompanysearchComponent;
  let fixture: ComponentFixture<WisfeecompanysearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WisfeecompanysearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WisfeecompanysearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
