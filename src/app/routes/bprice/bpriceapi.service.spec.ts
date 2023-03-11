import { TestBed, inject } from '@angular/core/testing';

import { BpriceapiService } from './bpriceapi.service';

describe('BpriceapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BpriceapiService]
    });
  });

  it('should be created', inject([BpriceapiService], (service: BpriceapiService) => {
    expect(service).toBeTruthy();
  }));
});
