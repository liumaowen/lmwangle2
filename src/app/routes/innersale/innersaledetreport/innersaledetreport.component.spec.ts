import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnersaledetreportComponent } from './innersaledetreport.component';

describe('InnersaledetreportComponent', () => {
  let component: InnersaledetreportComponent;
  let fixture: ComponentFixture<InnersaledetreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnersaledetreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnersaledetreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
