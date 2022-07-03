import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZhiyajindetailComponent } from './zhiyajindetail.component';

describe('ZhiyajindetailComponent', () => {
  let component: ZhiyajindetailComponent;
  let fixture: ComponentFixture<ZhiyajindetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZhiyajindetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZhiyajindetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
