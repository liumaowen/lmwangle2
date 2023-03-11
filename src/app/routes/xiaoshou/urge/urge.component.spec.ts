import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgeComponent } from './urge.component';

describe('UrgeComponent', () => {
  let component: UrgeComponent;
  let fixture: ComponentFixture<UrgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
