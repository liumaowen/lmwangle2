import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaigoujiaofureportComponent } from './caigoujiaofureport.component';

describe('CaigoujiaofureportComponent', () => {
  let component: CaigoujiaofureportComponent;
  let fixture: ComponentFixture<CaigoujiaofureportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaigoujiaofureportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaigoujiaofureportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
