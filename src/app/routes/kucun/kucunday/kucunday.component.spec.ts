import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KucundayComponent } from './kucunday.component';

describe('KucundayComponent', () => {
  let component: KucundayComponent;
  let fixture: ComponentFixture<KucundayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KucundayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KucundayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
