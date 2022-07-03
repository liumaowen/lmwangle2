import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WiskfindbysaleComponent } from './wiskfindbysale.component';

describe('WiskfindbysaleComponent', () => {
  let component: WiskfindbysaleComponent;
  let fixture: ComponentFixture<WiskfindbysaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiskfindbysaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiskfindbysaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
