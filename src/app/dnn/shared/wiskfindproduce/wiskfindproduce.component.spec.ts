import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WiskfindproduceComponent } from './wiskfindproduce.component';

describe('WiskfindproduceComponent', () => {
  let component: WiskfindproduceComponent;
  let fixture: ComponentFixture<WiskfindproduceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiskfindproduceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiskfindproduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
