import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaitukucunimportComponent } from './zaitukucunimport.component';

describe('ZaitukucunimportComponent', () => {
  let component: ZaitukucunimportComponent;
  let fixture: ComponentFixture<ZaitukucunimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZaitukucunimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZaitukucunimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
