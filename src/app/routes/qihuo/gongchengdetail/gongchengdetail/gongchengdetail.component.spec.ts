import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GongchengdetailComponent } from './gongchengdetail.component';

describe('GongchengdetailComponent', () => {
  let component: GongchengdetailComponent;
  let fixture: ComponentFixture<GongchengdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GongchengdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GongchengdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
