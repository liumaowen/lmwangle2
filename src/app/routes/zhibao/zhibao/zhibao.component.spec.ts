import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZhibaoComponent } from './zhibao.component';

describe('ZhibaoComponent', () => {
  let component: ZhibaoComponent;
  let fixture: ComponentFixture<ZhibaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZhibaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZhibaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
