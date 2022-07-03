import { TestBed, inject } from '@angular/core/testing';

import { BpricelogapiService } from './bpricelogapi.service';

describe('BpricelogapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BpricelogapiService]
    });
  });

  it('should be created', inject([BpricelogapiService], (service: BpricelogapiService) => {
    expect(service).toBeTruthy();
  }));
});
