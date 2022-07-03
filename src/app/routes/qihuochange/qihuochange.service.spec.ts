import { TestBed, inject } from '@angular/core/testing';

import { QihuochangeService } from './qihuochange.service';

describe('QihuochangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QihuochangeService]
    });
  });

  it('should be created', inject([QihuochangeService], (service: QihuochangeService) => {
    expect(service).toBeTruthy();
  }));
});
