import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KucunComponent } from './kucun.component';

describe('KucunComponent', () => {
  let component: KucunComponent;
  let fixture: ComponentFixture<KucunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KucunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KucunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
