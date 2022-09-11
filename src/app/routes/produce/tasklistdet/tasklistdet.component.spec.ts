import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasklistdetComponent } from './tasklistdet.component';

describe('ProducedetComponent', () => {
  let component: TasklistdetComponent;
  let fixture: ComponentFixture<TasklistdetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasklistdetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasklistdetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
