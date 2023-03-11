import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WiskorglistComponent } from './wiskorglist.component';

describe('WiskorglistComponent', () => {
  let component: WiskorglistComponent;
  let fixture: ComponentFixture<WiskorglistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiskorglistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiskorglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
