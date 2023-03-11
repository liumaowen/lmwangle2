import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CangkutihuoComponent } from './cangkutihuo.component';

describe('TihuoComponent', () => {
  let component: CangkutihuoComponent;
  let fixture: ComponentFixture<CangkutihuoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CangkutihuoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CangkutihuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
