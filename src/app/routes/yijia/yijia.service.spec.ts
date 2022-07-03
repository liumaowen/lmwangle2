import { TestBed, inject } from '@angular/core/testing';

import { YijiaapiService } from './yijiaapi.service';

describe('YijiaapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YijiaapiService]
    });
  });

  it('should be created', inject([YijiaapiService], (service: YijiaapiService) => {
    expect(service).toBeTruthy();
  }));
});
