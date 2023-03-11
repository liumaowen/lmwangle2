import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CgwanglaiComponent } from './cgwanglai.component';

describe('CgwanglaiComponent', () => {
  let component: CgwanglaiComponent;
  let fixture: ComponentFixture<CgwanglaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CgwanglaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CgwanglaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
