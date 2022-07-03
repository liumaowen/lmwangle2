import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdtihuoComponent } from './ldtihuo.component';

describe('LdtihuoComponent', () => {
  let component: LdtihuoComponent;
  let fixture: ComponentFixture<LdtihuoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdtihuoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdtihuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
