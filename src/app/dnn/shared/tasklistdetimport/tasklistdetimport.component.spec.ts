import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasklistdetimportComponent } from './tasklistdetimport.component';

describe('TasklistdetimportComponent', () => {
  let component: TasklistdetimportComponent;
  let fixture: ComponentFixture<TasklistdetimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasklistdetimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasklistdetimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
