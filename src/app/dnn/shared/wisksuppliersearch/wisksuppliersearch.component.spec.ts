import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WisksuppliersearchComponent } from './wisksuppliersearch.component';

describe('WisksuppliersearchComponent', () => {
  let component: WisksuppliersearchComponent;
  let fixture: ComponentFixture<WisksuppliersearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WisksuppliersearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WisksuppliersearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
