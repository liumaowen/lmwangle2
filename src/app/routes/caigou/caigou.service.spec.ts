import { TestBed, inject } from '@angular/core/testing';

import { CaigouService } from './caigou.service';

describe('CaigouService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaigouService]
    });
  });

  it('should ...', inject([CaigouService], (service: CaigouService) => {
    expect(service).toBeTruthy();
  }));
});
