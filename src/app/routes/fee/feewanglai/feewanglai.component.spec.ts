import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeewanglaiComponent } from './feewanglai.component';

describe('FeewanglaiComponent', () => {
  let component: FeewanglaiComponent;
  let fixture: ComponentFixture<FeewanglaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeewanglaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeewanglaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
