import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeicaigoufapiaodetailComponent } from './neicaigoufapiaodetail.component';

describe('NeicaigoufapiaodetailComponent', () => {
  let component: NeicaigoufapiaodetailComponent;
  let fixture: ComponentFixture<NeicaigoufapiaodetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeicaigoufapiaodetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeicaigoufapiaodetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
