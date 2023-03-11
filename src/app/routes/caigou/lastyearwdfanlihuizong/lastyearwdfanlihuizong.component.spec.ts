import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastyearwdfanlihuizongComponent } from './lastyearwdfanlihuizong.component';

describe('LastyearwdfanlihuizongComponent', () => {
  let component: LastyearwdfanlihuizongComponent;
  let fixture: ComponentFixture<LastyearwdfanlihuizongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastyearwdfanlihuizongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastyearwdfanlihuizongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
