import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WiskfindbybillnoComponent } from './wiskfindbybillno.component';

describe('WiskfindbybillnoComponent', () => {
  let component: WiskfindbybillnoComponent;
  let fixture: ComponentFixture<WiskfindbybillnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiskfindbybillnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiskfindbybillnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
