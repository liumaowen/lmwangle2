import { TestBed, inject } from '@angular/core/testing';

import { FeeapiService } from './feeapi.service';

describe('FeeapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeeapiService]
    });
  });

  it('should be created', inject([FeeapiService], (service: FeeapiService) => {
    expect(service).toBeTruthy();
  }));
});
