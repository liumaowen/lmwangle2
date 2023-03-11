import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZentaoComponent } from './zentao.component';

describe('ZentaoComponent', () => {
  let component: ZentaoComponent;
  let fixture: ComponentFixture<ZentaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZentaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZentaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
