import { TestBed, inject } from '@angular/core/testing';

import { KaishiapiService } from './kaishiapi.service';

describe('KaishiapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KaishiapiService]
    });
  });

  it('should be created', inject([KaishiapiService], (service: KaishiapiService) => {
    expect(service).toBeTruthy();
  }));
});
