import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CgbuchadetailComponent } from './cgbuchadetail.component';

describe('CgbuchadetailComponent', () => {
  let component: CgbuchadetailComponent;
  let fixture: ComponentFixture<CgbuchadetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CgbuchadetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CgbuchadetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
