import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeyueComponent } from './feeyue.component';

describe('FeeyueComponent', () => {
  let component: FeeyueComponent;
  let fixture: ComponentFixture<FeeyueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeyueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeyueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
