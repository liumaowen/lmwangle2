import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CgfanliComponent } from './cgfanli.component';

describe('CgfanliComponent', () => {
  let component: CgfanliComponent;
  let fixture: ComponentFixture<CgfanliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CgfanliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CgfanliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
