import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskdetComponent } from './taskdet.component';

describe('TaskdetComponent', () => {
  let component: TaskdetComponent;
  let fixture: ComponentFixture<TaskdetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskdetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskdetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
