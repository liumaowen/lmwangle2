import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WiskinnercompanyComponent } from './wiskinnercompany.component';

describe('WiskinnercompanyComponent', () => {
  let component: WiskinnercompanyComponent;
  let fixture: ComponentFixture<WiskinnercompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiskinnercompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiskinnercompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
