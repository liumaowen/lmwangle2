import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YanqitihuoComponent2 } from './yanqitihuo.component';

describe('TihuoComponent', () => {
  let component: YanqitihuoComponent2;
  let fixture: ComponentFixture<YanqitihuoComponent2>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YanqitihuoComponent2 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YanqitihuoComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
