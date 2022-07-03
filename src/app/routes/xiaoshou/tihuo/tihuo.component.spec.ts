import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TihuoComponent } from './tihuo.component';

describe('TihuoComponent', () => {
  let component: TihuoComponent;
  let fixture: ComponentFixture<TihuoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TihuoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TihuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
