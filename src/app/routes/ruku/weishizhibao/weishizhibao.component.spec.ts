import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeishizhibaoComponent } from './weishizhibao.component';

describe('ProductzhijianComponent', () => {
  let component: WeishizhibaoComponent;
  let fixture: ComponentFixture<WeishizhibaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeishizhibaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeishizhibaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
