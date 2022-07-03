import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeehuizongComponent } from './feehuizong.component';

describe('FeehuizongComponent', () => {
  let component: FeehuizongComponent;
  let fixture: ComponentFixture<FeehuizongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeehuizongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeehuizongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
