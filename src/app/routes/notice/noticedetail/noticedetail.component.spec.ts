import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticedetailComponent } from './noticedetail.component';

describe('NoticedetailComponent', () => {
  let component: NoticedetailComponent;
  let fixture: ComponentFixture<NoticedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
