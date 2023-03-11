import { TestBed, inject } from '@angular/core/testing';

import { ShoukuanService } from './shoukuan.service';

describe('ShoukuanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShoukuanService]
    });
  });

  it('should ...', inject([ShoukuanService], (service: ShoukuanService) => {
    expect(service).toBeTruthy();
  }));
});
