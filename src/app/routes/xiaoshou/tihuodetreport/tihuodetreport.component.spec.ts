import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TihuodetreportComponent } from './tihuodetreport.component';

describe('TihuodetreportComponent', () => {
  let component: TihuodetreportComponent;
  let fixture: ComponentFixture<TihuodetreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TihuodetreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TihuodetreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
