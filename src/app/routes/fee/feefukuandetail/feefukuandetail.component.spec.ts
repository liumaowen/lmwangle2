import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeefukuandetailComponent } from './feefukuandetail.component';

describe('FeefukuandetailComponent', () => {
  let component: FeefukuandetailComponent;
  let fixture: ComponentFixture<FeefukuandetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeefukuandetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeefukuandetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
