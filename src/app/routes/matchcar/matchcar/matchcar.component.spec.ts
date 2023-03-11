import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchcarComponent } from './matchcar.component';

describe('MatchcarComponent', () => {
  let component: MatchcarComponent;
  let fixture: ComponentFixture<MatchcarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchcarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchcarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
