import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnertransferreportComponent } from './innertransferreport.component';

describe('InnertransferreportComponent', () => {
  let component: InnertransferreportComponent;
  let fixture: ComponentFixture<InnertransferreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnertransferreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnertransferreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
