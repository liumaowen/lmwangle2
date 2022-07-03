import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LirunkaoheComponent } from './lirunkaohe.component';

describe('LirunkaoheComponent', () => {
  let component: LirunkaoheComponent;
  let fixture: ComponentFixture<LirunkaoheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LirunkaoheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LirunkaoheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
