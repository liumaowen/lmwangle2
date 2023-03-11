import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JinhuoguanzhiComponent } from './jinhuoguanzhi.component';

describe('JinhuoguanzhiComponent', () => {
  let component: JinhuoguanzhiComponent;
  let fixture: ComponentFixture<JinhuoguanzhiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JinhuoguanzhiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JinhuoguanzhiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
