import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducedetailComponent } from './producedetail.component';

describe('ProducedetailComponent', () => {
  let component: ProducedetailComponent;
  let fixture: ComponentFixture<ProducedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
