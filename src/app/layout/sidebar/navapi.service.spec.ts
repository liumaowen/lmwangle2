import { TestBed, inject } from '@angular/core/testing';

import { NavapiService } from './navapi.service';

describe('NavapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavapiService]
    });
  });

  it('should ...', inject([NavapiService], (service: NavapiService) => {
    expect(service).toBeTruthy();
  }));
});
