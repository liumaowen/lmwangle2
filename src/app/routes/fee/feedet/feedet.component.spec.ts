import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedetComponent } from './feedet.component';

describe('FeedetComponent', () => {
  let component: FeedetComponent;
  let fixture: ComponentFixture<FeedetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
