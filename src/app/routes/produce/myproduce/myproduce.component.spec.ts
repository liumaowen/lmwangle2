import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyproduceComponent } from './myproduce.component';

describe('MyproduceComponent', () => {
  let component: MyproduceComponent;
  let fixture: ComponentFixture<MyproduceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyproduceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyproduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
