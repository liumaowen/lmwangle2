import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TihuodetailComponent } from './tihuodetail.component';

describe('TihuodetailComponent', () => {
  let component: TihuodetailComponent;
  let fixture: ComponentFixture<TihuodetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TihuodetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TihuodetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
