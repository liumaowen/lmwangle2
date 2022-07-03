import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdraftdetailComponent } from './overdraftdetail.component';

describe('OverdraftdetailComponent', () => {
  let component: OverdraftdetailComponent;
  let fixture: ComponentFixture<OverdraftdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdraftdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdraftdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
