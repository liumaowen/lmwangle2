import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdtihuodetailComponent } from './ldtihuodetail.component';

describe('LdtihuodetailComponent', () => {
  let component: LdtihuodetailComponent;
  let fixture: ComponentFixture<LdtihuodetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdtihuodetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdtihuodetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
