import { TestBed, inject } from '@angular/core/testing';

import { CgbuchaapiService } from './cgbuchaapi.service';

describe('CgbuchaapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CgbuchaapiService]
    });
  });

  it('should ...', inject([CgbuchaapiService], (service: CgbuchaapiService) => {
    expect(service).toBeTruthy();
  }));
});
