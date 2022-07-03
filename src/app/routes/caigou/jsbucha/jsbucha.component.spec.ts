import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsbuchaComponent } from './jsbucha.component';

describe('JsbuchaComponent', () => {
  let component: JsbuchaComponent;
  let fixture: ComponentFixture<JsbuchaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsbuchaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsbuchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
