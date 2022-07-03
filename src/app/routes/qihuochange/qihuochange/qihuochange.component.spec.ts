import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QihuochangeComponent } from './qihuochange.component';

describe('QihuochangeComponent', () => {
  let component: QihuochangeComponent;
  let fixture: ComponentFixture<QihuochangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QihuochangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QihuochangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
