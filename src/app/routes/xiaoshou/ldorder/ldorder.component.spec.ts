import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdorderComponent } from './ldorder.component';

describe('LdorderComponent', () => {
  let component: LdorderComponent;
  let fixture: ComponentFixture<LdorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
