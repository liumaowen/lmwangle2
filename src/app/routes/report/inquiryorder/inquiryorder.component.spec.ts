import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryorderComponent } from './inquiryorder.component';

describe('InquiryorderComponent', () => {
  let component: InquiryorderComponent;
  let fixture: ComponentFixture<InquiryorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InquiryorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
