import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycustomerComponent } from './mycustomer.component';

describe('MycustomerComponent', () => {
  let component: MycustomerComponent;
  let fixture: ComponentFixture<MycustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
