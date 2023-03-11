import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaycurloanComponent } from './maycurloan.component';

describe('MaycurloanComponent', () => {
  let component: MaycurloanComponent;
  let fixture: ComponentFixture<MaycurloanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaycurloanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaycurloanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
