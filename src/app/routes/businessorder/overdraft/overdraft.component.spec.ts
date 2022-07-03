import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdraftComponent } from './overdraft.component';

describe('OverdraftComponent', () => {
  let component: OverdraftComponent;
  let fixture: ComponentFixture<OverdraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
