import { TestBed, inject } from '@angular/core/testing';

import { BanksmsapiService } from './banksmsapi.service';

describe('BanksmsapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BanksmsapiService]
    });
  });

  it('should be created', inject([BanksmsapiService], (service: BanksmsapiService) => {
    expect(service).toBeTruthy();
  }));
});
