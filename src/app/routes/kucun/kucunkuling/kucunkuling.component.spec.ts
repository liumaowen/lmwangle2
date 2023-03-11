import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KucunkulingComponent } from './kucunkuling.component';

describe('KucunkulingComponent', () => {
  let component: KucunkulingComponent;
  let fixture: ComponentFixture<KucunkulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KucunkulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KucunkulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
