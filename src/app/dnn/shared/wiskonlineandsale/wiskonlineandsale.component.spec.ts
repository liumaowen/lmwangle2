import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WiskonlineandsaleComponent } from './wiskonlineandsale.component';

describe('WiskinnercompanyComponent', () => {
  let component: WiskonlineandsaleComponent;
  let fixture: ComponentFixture<WiskonlineandsaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiskonlineandsaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiskonlineandsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
