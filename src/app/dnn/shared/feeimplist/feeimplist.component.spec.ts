import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeimplistComponent } from './feeimplist.component';

describe('FeeimplistComponent', () => {
  let component: FeeimplistComponent;
  let fixture: ComponentFixture<FeeimplistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeimplistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeimplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
