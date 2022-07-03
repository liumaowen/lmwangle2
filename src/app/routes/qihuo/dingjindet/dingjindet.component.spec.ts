import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DingjindetComponent } from './dingjindet.component';

describe('DingjindetComponent', () => {
  let component: DingjindetComponent;
  let fixture: ComponentFixture<DingjindetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DingjindetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DingjindetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
