import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsbuchadetComponent } from './jsbuchadet.component';

describe('JsbuchadetComponent', () => {
  let component: JsbuchadetComponent;
  let fixture: ComponentFixture<JsbuchadetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsbuchadetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsbuchadetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
