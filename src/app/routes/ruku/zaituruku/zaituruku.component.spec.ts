import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RukuComponent } from './ruku.component';

describe('RukuComponent', () => {
  let component: RukuComponent;
  let fixture: ComponentFixture<RukuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RukuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RukuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
