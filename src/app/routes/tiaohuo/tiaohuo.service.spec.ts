import { TestBed, inject } from '@angular/core/testing';

import { TiaohuoService } from './tiaohuo.service';

describe('TiaohuoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TiaohuoService]
    });
  });

  it('should be created', inject([TiaohuoService], (service: TiaohuoService) => {
    expect(service).toBeTruthy();
  }));
});
