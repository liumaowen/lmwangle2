import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeefukuanComponent } from './feefukuan.component';

describe('FeefukuanComponent', () => {
  let component: FeefukuanComponent;
  let fixture: ComponentFixture<FeefukuanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeefukuanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeefukuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
