import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaipiaoComponent } from './kaipiao.component';

describe('KaipiaoComponent', () => {
  let component: KaipiaoComponent;
  let fixture: ComponentFixture<KaipiaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaipiaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaipiaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
