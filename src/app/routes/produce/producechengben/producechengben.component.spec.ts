import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducechengbenComponent } from './producechengben.component';

describe('ProducechengbenComponent', () => {
  let component: ProducechengbenComponent;
  let fixture: ComponentFixture<ProducechengbenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducechengbenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducechengbenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
