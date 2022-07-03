import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeicaigoufapiaoreporterComponent } from './neicaigoufapiaoreporter.component';

describe('NeicaigoufapiaoreporterComponent', () => {
  let component: NeicaigoufapiaoreporterComponent;
  let fixture: ComponentFixture<NeicaigoufapiaoreporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeicaigoufapiaoreporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeicaigoufapiaoreporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
