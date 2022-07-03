import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KucuncheckComponent } from './kucuncheck.component';

describe('KucuncheckComponent', () => {
  let component: KucuncheckComponent;
  let fixture: ComponentFixture<KucuncheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KucuncheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KucuncheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
