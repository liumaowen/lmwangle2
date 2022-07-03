import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedetailComponent } from './receivedetail.component';

describe('ReceivedetailComponent', () => {
  let component: ReceivedetailComponent;
  let fixture: ComponentFixture<ReceivedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
