import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessorderComponent } from './businessorder.component';

describe('BusinessorderComponent', () => {
  let component: BusinessorderComponent;
  let fixture: ComponentFixture<BusinessorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
