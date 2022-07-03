import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeefukuandetreporterComponent } from './feefukuandetreporter.component';

describe('FeefukuandetreporterComponent', () => {
  let component: FeefukuandetreporterComponent;
  let fixture: ComponentFixture<FeefukuandetreporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeefukuandetreporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeefukuandetreporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
