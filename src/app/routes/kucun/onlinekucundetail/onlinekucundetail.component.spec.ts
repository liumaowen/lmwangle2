import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KucundetailComponent } from './kucundetail.component';

describe('KucundetailComponent', () => {
  let component: KucundetailComponent;
  let fixture: ComponentFixture<KucundetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KucundetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KucundetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
