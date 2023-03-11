import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RukucollectedetimportComponent } from './rukucollectedetimport.component';

describe('RukucollectedetimportComponent', () => {
  let component: RukucollectedetimportComponent;
  let fixture: ComponentFixture<RukucollectedetimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RukucollectedetimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RukucollectedetimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
