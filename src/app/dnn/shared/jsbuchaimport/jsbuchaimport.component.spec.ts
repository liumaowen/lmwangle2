import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsbuchaimportComponent } from './jsbuchaimport.component';

describe('JsbuchaimportComponent', () => {
  let component: JsbuchaimportComponent;
  let fixture: ComponentFixture<JsbuchaimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsbuchaimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsbuchaimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
