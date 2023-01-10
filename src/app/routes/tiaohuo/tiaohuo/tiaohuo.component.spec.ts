import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiaohuoComponent } from './tiaohuo.component';

describe('TiaohuoComponent', () => {
  let component: TiaohuoComponent;
  let fixture: ComponentFixture<TiaohuoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiaohuoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiaohuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
