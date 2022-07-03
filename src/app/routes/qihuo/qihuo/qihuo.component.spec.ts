import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QihuoComponent } from './qihuo.component';

describe('QihuoComponent', () => {
  let component: QihuoComponent;
  let fixture: ComponentFixture<QihuoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QihuoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QihuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
