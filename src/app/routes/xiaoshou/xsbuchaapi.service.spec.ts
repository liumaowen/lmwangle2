import { TestBed, inject } from '@angular/core/testing';

import { XsbuchaapiService } from './xsbuchaapi.service';

describe('XsbuchaapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XsbuchaapiService]
    });
  });

  it('should ...', inject([XsbuchaapiService], (service: XsbuchaapiService) => {
    expect(service).toBeTruthy();
  }));
});
