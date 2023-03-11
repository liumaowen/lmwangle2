import { TestBed, inject } from '@angular/core/testing';

import { AllotapiService } from './allotapi.service';

describe('AllotapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllotapiService]
    });
  });

  it('should ...', inject([AllotapiService], (service: AllotapiService) => {
    expect(service).toBeTruthy();
  }));
});
