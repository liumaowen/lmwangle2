import { TestBed, inject } from '@angular/core/testing';

import { QihuoService } from './qihuo.service';

describe('QihuoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QihuoService]
    });
  });

  it('should ...', inject([QihuoService], (service: QihuoService) => {
    expect(service).toBeTruthy();
  }));
});
