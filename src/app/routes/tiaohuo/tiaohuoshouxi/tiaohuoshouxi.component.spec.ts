import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiaohuoshouxiComponent } from './tiaohuoshouxi.component';

describe('TiaohuoshouxiComponent', () => {
  let component: TiaohuoshouxiComponent;
  let fixture: ComponentFixture<TiaohuoshouxiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiaohuoshouxiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiaohuoshouxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
