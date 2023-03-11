import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YunfeeComponent } from './yunfee.component';

describe('YunfeeComponent', () => {
  let component: YunfeeComponent;
  let fixture: ComponentFixture<YunfeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YunfeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YunfeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
