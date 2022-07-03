import { TestBed, inject } from '@angular/core/testing';

import { FeefukuanapiService } from './feefukuanapi.service';

describe('FeefukuanapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeefukuanapiService]
    });
  });

  it('should be created', inject([FeefukuanapiService], (service: FeefukuanapiService) => {
    expect(service).toBeTruthy();
  }));
});
