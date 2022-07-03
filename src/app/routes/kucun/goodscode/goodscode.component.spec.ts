import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodscodeComponent } from './goodscode.component';

describe('GoodscodeComponent', () => {
  let component: GoodscodeComponent;
  let fixture: ComponentFixture<GoodscodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodscodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodscodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
