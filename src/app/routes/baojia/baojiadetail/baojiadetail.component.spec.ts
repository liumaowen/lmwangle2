import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaojiadetailComponent } from './baojiadetail.component';

describe('BaojiadetailComponent', () => {
  let component: BaojiadetailComponent;
  let fixture: ComponentFixture<BaojiadetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaojiadetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaojiadetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
