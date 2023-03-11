import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CgwanglaiyueComponent } from './cgwanglaiyue.component';

describe('CgwanglaiyueComponent', () => {
  let component: CgwanglaiyueComponent;
  let fixture: ComponentFixture<CgwanglaiyueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CgwanglaiyueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CgwanglaiyueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
