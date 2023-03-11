import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CgbuchaimportComponent } from './cgbuchaimport.component';

describe('CgbuchaimportComponent', () => {
  let component: CgbuchaimportComponent;
  let fixture: ComponentFixture<CgbuchaimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CgbuchaimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CgbuchaimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
