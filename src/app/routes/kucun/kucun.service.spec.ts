import { TestBed, inject } from '@angular/core/testing';

import { KucunService } from './kucun.service';

describe('KucunService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KucunService]
    });
  });

  it('should ...', inject([KucunService], (service: KucunService) => {
    expect(service).toBeTruthy();
  }));
});
