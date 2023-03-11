import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YunfeedetailComponent } from './yunfeedetail.component';

describe('YunfeedetailComponent', () => {
  let component: YunfeedetailComponent;
  let fixture: ComponentFixture<YunfeedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YunfeedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YunfeedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
