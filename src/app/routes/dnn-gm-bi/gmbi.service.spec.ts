import { TestBed, inject } from '@angular/core/testing';

import { GmbiService } from './gmbi.service';

describe('GmbiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GmbiService]
    });
  });

  it('should ...', inject([GmbiService], (service: GmbiService) => {
    expect(service).toBeTruthy();
  }));
});
