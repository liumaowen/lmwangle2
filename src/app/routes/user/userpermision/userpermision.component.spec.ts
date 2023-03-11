import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserpermisionComponent } from './userpermision.component';

describe('UserpermisionComponent', () => {
  let component: UserpermisionComponent;
  let fixture: ComponentFixture<UserpermisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserpermisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserpermisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
