import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomermoneyComponent } from './customermoney.component';

describe('CustomermoneyComponent', () => {
  let component: CustomermoneyComponent;
  let fixture: ComponentFixture<CustomermoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomermoneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomermoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
