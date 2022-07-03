import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WstihuodetreportComponent } from './wstihuodetreport.component';

describe('WstihuodetreportComponent', () => {
  let component: WstihuodetreportComponent;
  let fixture: ComponentFixture<WstihuodetreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WstihuodetreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WstihuodetreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
