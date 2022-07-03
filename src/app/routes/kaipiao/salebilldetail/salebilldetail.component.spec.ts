import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalebilldetailComponent } from './salebilldetail.component';

describe('SalebilldetailComponent', () => {
  let component: SalebilldetailComponent;
  let fixture: ComponentFixture<SalebilldetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalebilldetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalebilldetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
