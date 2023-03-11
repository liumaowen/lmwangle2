import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassifydetailComponent } from './classifydetail.component';

describe('ClassifydetailComponent', () => {
  let component: ClassifydetailComponent;
  let fixture: ComponentFixture<ClassifydetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassifydetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
