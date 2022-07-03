import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TudufenxiComponent } from './tudufenxi.component';

describe('TudufenxiComponent', () => {
  let component: TudufenxiComponent;
  let fixture: ComponentFixture<TudufenxiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TudufenxiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TudufenxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
