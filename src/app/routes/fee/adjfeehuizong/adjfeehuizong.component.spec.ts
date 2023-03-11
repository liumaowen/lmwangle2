import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjfeehuizongComponent } from './adjfeehuizong.component';

describe('AdjfeehuizongComponent', () => {
  let component: AdjfeehuizongComponent;
  let fixture: ComponentFixture<AdjfeehuizongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjfeehuizongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjfeehuizongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
