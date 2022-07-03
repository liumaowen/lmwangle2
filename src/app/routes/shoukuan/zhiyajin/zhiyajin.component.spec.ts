import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZhiyajinComponent } from './zhiyajin.component';

describe('ZhiyajinComponent', () => {
  let component: ZhiyajinComponent;
  let fixture: ComponentFixture<ZhiyajinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZhiyajinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZhiyajinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
