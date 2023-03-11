import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WiskcustomersearchComponent } from './wiskcustomersearch.component';

describe('WiskcustomersearchComponent', () => {
  let component: WiskcustomersearchComponent;
  let fixture: ComponentFixture<WiskcustomersearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiskcustomersearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiskcustomersearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
