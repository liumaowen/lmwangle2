import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CangkudetailComponent } from './cangkudetail.component';

describe('CangkudetailComponent', () => {
  let component: CangkudetailComponent;
  let fixture: ComponentFixture<CangkudetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CangkudetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CangkudetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
