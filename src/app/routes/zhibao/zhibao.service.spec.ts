import { TestBed, inject } from '@angular/core/testing';

import { ZhibaoService } from './zhibao.service';

describe('ZhibaoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZhibaoService]
    });
  });

  it('should ...', inject([ZhibaoService], (service: ZhibaoService) => {
    expect(service).toBeTruthy();
  }));
});
