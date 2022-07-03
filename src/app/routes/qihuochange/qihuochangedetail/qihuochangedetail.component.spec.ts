import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QihuochangedetailComponent } from './qihuochangedetail.component';

describe('QihuochangedetailComponent', () => {
  let component: QihuochangedetailComponent;
  let fixture: ComponentFixture<QihuochangedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QihuochangedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QihuochangedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
