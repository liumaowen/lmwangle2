import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseractiveComponent } from './useractive.component';

describe('UseractiveComponent', () => {
  let component: UseractiveComponent;
  let fixture: ComponentFixture<UseractiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseractiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseractiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
