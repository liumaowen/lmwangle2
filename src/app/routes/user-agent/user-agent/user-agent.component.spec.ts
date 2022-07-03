import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAgentComponent } from './user-agent.component';

describe('UserAgentComponent', () => {
  let component: UserAgentComponent;
  let fixture: ComponentFixture<UserAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
