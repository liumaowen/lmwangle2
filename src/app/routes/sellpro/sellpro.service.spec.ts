import { TestBed, inject } from '@angular/core/testing';

import { SellproService } from './sellpro.service';

describe('SellproService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SellproService]
    });
  });

  it('should ...', inject([SellproService], (service: SellproService) => {
    expect(service).toBeTruthy();
  }));
});
