import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KucuncheckhuizongComponent } from './kucuncheckhuizong.component';

describe('KucuncheckComponent', () => {
  let component: KucuncheckhuizongComponent;
  let fixture: ComponentFixture<KucuncheckhuizongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KucuncheckhuizongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KucuncheckhuizongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
