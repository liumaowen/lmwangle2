import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerchangeComponent } from './customerchange.component';

describe('CustomerreportComponent', () => {
  let component: CustomerchangeComponent;
  let fixture: ComponentFixture<CustomerchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerchangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
