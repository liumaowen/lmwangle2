import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycustomerdetailComponent } from './mycustomerdetail.component';

describe('MycustomerdetailComponent', () => {
  let component: MycustomerdetailComponent;
  let fixture: ComponentFixture<MycustomerdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycustomerdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycustomerdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
