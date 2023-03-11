import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JixiaotemplateComponent } from './jixiaotemplate.component';

describe('JixiaotemplateComponent', () => {
  let component: JixiaotemplateComponent;
  let fixture: ComponentFixture<JixiaotemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JixiaotemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JixiaotemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
