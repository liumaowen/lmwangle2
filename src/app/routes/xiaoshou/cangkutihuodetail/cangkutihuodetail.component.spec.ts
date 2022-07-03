import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CangkutihuodetailComponent } from './cangkutihuodetail.component';

describe('TihuoComponent', () => {
  let component: CangkutihuodetailComponent;
  let fixture: ComponentFixture<CangkutihuodetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CangkutihuodetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CangkutihuodetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
