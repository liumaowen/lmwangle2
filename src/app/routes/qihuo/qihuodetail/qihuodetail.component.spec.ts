import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QihuodetailComponent } from './qihuodetail.component';

describe('QihuodetailComponent', () => {
  let component: QihuodetailComponent;
  let fixture: ComponentFixture<QihuodetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QihuodetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QihuodetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
