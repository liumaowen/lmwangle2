import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserroleComponent } from './userrole.component';

describe('UserroleComponent', () => {
  let component: UserroleComponent;
  let fixture: ComponentFixture<UserroleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserroleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
