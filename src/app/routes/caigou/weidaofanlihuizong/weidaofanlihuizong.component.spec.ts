import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeidaofanlihuizongComponent } from './weidaofanlihuizong.component';

describe('WeidaofanlihuizongComponent', () => {
  let component: WeidaofanlihuizongComponent;
  let fixture: ComponentFixture<WeidaofanlihuizongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeidaofanlihuizongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeidaofanlihuizongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
