import { TestBed, inject } from '@angular/core/testing';

import { PaymentapiService } from './paymentapi.service';

describe('PaymentapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentapiService]
    });
  });

  it('should be created', inject([PaymentapiService], (service: PaymentapiService) => {
    expect(service).toBeTruthy();
  }));
});
