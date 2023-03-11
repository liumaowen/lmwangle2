import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchcardetailComponent } from './matchcardetail.component';

describe('MatchcardetailComponent', () => {
  let component: MatchcardetailComponent;
  let fixture: ComponentFixture<MatchcardetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchcardetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchcardetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
