import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DingjinshouxiComponent } from './dingjinshouxi.component';

describe('DingjinshouxiComponent', () => {
  let component: DingjinshouxiComponent;
  let fixture: ComponentFixture<DingjinshouxiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DingjinshouxiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DingjinshouxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
