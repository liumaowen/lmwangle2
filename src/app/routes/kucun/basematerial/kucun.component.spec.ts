import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasematerialComponent } from './basematerial.component';

describe('BasematerialComponent', () => {
  let component: BasematerialComponent;
  let fixture: ComponentFixture<BasematerialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasematerialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasematerialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
