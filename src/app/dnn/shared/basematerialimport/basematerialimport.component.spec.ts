import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasematerialimportComponent } from './basematerialimport.component';

describe('BasematerialimportComponent', () => {
  let component: BasematerialimportComponent;
  let fixture: ComponentFixture<BasematerialimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasematerialimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasematerialimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
