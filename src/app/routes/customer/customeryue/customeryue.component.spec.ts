import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeryueComponent } from './customeryue.component';

describe('CustomeryueComponent', () => {
  let component: CustomeryueComponent;
  let fixture: ComponentFixture<CustomeryueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomeryueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeryueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
