import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WiskusersearchComponent } from './wiskusersearch.component';

describe('WiskusersearchComponent', () => {
  let component: WiskusersearchComponent;
  let fixture: ComponentFixture<WiskusersearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiskusersearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiskusersearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
