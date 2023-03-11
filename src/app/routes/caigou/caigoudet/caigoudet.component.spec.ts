import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaigoudetComponent } from './caigoudet.component';

describe('CaigoudetComponent', () => {
  let component: CaigoudetComponent;
  let fixture: ComponentFixture<CaigoudetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaigoudetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaigoudetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
