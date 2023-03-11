import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KucunsaledetailComponent } from './kucunsaledetail.component';

describe('KucunsaledetailComponent', () => {
  let component: KucunsaledetailComponent;
  let fixture: ComponentFixture<KucunsaledetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KucunsaledetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KucunsaledetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
