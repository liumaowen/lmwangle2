import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoukuanhuizongComponent } from './shoukuanhuizong.component';

describe('ShoukuanhuizongComponent', () => {
  let component: ShoukuanhuizongComponent;
  let fixture: ComponentFixture<ShoukuanhuizongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoukuanhuizongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoukuanhuizongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
