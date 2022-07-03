import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverduekucunComponent } from './overduekucun.component';

describe('OverduekucunComponent', () => {
  let component: OverduekucunComponent;
  let fixture: ComponentFixture<OverduekucunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverduekucunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverduekucunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
