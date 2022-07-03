import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserchandiComponent } from './userchandi.component';

describe('UserchandiComponent', () => {
  let component: UserchandiComponent;
  let fixture: ComponentFixture<UserchandiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserchandiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserchandiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
