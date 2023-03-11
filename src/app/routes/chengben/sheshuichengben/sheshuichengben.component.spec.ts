import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheshuichengbenComponent } from './sheshuichengben.component';

describe('OnechengbenComponent', () => {
  let component: SheshuichengbenComponent;
  let fixture: ComponentFixture<SheshuichengbenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheshuichengbenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheshuichengbenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
