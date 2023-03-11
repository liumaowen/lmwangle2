import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ReceiptreportComponent} from './receiptreport.component';


describe('ReceiptreportComponent', () => {
  let component: ReceiptreportComponent;
  let fixture: ComponentFixture<ReceiptreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptreportComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
