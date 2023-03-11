import { TestBed, inject } from '@angular/core/testing';

import { MatchcarService } from './matchcar.service';

describe('MatchcarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatchcarService]
    });
  });

  it('should be created', inject([MatchcarService], (service: MatchcarService) => {
    expect(service).toBeTruthy();
  }));
});
