import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycustomerusersComponent } from './mycustomerusers.component';

describe('MycustomerusersComponent', () => {
  let component: MycustomerusersComponent;
  let fixture: ComponentFixture<MycustomerusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycustomerusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycustomerusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
