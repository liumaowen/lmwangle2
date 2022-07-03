import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaigoudetimportComponent } from './caigoudetimport.component';

describe('CaigoudetimportComponent', () => {
  let component: CaigoudetimportComponent;
  let fixture: ComponentFixture<CaigoudetimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaigoudetimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaigoudetimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
