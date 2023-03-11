import { TestBed, inject } from '@angular/core/testing';

import { MaoliService } from './maoli.service';

describe('MaoliService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaoliService]
    });
  });

  it('should ...', inject([MaoliService], (service: MaoliService) => {
    expect(service).toBeTruthy();
  }));
});
