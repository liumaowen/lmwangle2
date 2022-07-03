import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CangkutimedetailComponent } from './cangkutimedetail.component';

describe('CangkutimedetailComponent', () => {
  let component: CangkutimedetailComponent;
  let fixture: ComponentFixture<CangkutimedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CangkutimedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CangkutimedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
