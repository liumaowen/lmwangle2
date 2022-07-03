import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoukuanreportComponent } from './shoukuanreport.component';

describe('ShoukuanreportComponent', () => {
  let component: ShoukuanreportComponent;
  let fixture: ComponentFixture<ShoukuanreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoukuanreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoukuanreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
