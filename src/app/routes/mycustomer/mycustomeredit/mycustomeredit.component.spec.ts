import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycustomereditComponent } from './mycustomeredit.component';

describe('MycustomereditComponent', () => {
  let component: MycustomereditComponent;
  let fixture: ComponentFixture<MycustomereditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycustomereditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycustomereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
