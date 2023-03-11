import { TestBed, inject } from '@angular/core/testing';

import { OrderapiService } from './orderapi.service';

describe('OrderapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderapiService]
    });
  });

  it('should ...', inject([OrderapiService], (service: OrderapiService) => {
    expect(service).toBeTruthy();
  }));
});
