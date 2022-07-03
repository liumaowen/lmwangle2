import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerbehaviorComponent } from './customerbehavior.component';

describe('CustomerbehaviorComponent', () => {
  let component: CustomerbehaviorComponent;
  let fixture: ComponentFixture<CustomerbehaviorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerbehaviorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerbehaviorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
