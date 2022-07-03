import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RukuCollectedetComponent } from './ruku-collectedet.component';

describe('RukuCollectedetComponent', () => {
  let component: RukuCollectedetComponent;
  let fixture: ComponentFixture<RukuCollectedetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RukuCollectedetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RukuCollectedetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
