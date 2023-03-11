import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducedetComponent } from './producedet.component';

describe('ProducedetComponent', () => {
  let component: ProducedetComponent;
  let fixture: ComponentFixture<ProducedetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducedetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducedetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
