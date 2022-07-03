import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotComponent } from './allot.component';

describe('AllotComponent', () => {
  let component: AllotComponent;
  let fixture: ComponentFixture<AllotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
