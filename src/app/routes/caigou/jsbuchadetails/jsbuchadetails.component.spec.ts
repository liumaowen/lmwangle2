import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsbuchadetailsComponent } from './jsbuchadetails.component';

describe('JsbuchadetailsComponent', () => {
  let component: JsbuchadetailsComponent;
  let fixture: ComponentFixture<JsbuchadetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsbuchadetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsbuchadetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
