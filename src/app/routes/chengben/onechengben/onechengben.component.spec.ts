import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnechengbenComponent } from './onechengben.component';

describe('OnechengbenComponent', () => {
  let component: OnechengbenComponent;
  let fixture: ComponentFixture<OnechengbenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnechengbenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnechengbenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
