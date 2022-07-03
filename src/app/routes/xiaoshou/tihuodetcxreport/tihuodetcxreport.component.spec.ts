import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TihuodetcxreportComponent } from './tihuodetcxreport.component';

describe('TihuodetcxreportComponent', () => {
  let component: TihuodetcxreportComponent;
  let fixture: ComponentFixture<TihuodetcxreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TihuodetcxreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TihuodetcxreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
