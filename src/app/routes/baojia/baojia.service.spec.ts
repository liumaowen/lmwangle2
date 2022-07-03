import { TestBed, inject } from '@angular/core/testing';

import { BaojiaService } from './baojia.service';

describe('BaojiaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaojiaService]
    });
  });

  it('should ...', inject([BaojiaService], (service: BaojiaService) => {
    expect(service).toBeTruthy();
  }));
});
