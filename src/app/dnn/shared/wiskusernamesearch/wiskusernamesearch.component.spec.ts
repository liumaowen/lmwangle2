import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WiskusernamesearchComponent } from './wiskusernamesearch.component';

describe('WiskusernamesearchComponent', () => {
  let component: WiskusernamesearchComponent;
  let fixture: ComponentFixture<WiskusernamesearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiskusernamesearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiskusernamesearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
