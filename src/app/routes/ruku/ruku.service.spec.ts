import { TestBed, inject } from '@angular/core/testing';

import { RukuService } from './ruku.service';

describe('RukuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RukuService]
    });
  });

  it('should ...', inject([RukuService], (service: RukuService) => {
    expect(service).toBeTruthy();
  }));
});
