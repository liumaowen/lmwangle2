import { TestBed, inject } from '@angular/core/testing';

import { ZentaoService } from './zentao.service';

describe('ZentaoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZentaoService]
    });
  });

  it('should be created', inject([ZentaoService], (service: ZentaoService) => {
    expect(service).toBeTruthy();
  }));
});
