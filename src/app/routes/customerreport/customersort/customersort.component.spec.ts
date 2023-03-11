import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CustomersortComponent} from './customersort.component';


describe('CustomersortComponent', () => {
  let component: CustomersortComponent;
  let fixture: ComponentFixture<CustomersortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomersortComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
