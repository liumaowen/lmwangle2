import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaoliComponent } from './maoli.component';

describe('MaoliComponent', () => {
  let component: MaoliComponent;
  let fixture: ComponentFixture<MaoliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaoliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaoliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
