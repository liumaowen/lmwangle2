import { TestBed, inject } from '@angular/core/testing';

import { PriceapiService } from './priceapi.service';

describe('PriceapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriceapiService]
    });
  });

  it('should be created', inject([PriceapiService], (service: PriceapiService) => {
    expect(service).toBeTruthy();
  }));
});
