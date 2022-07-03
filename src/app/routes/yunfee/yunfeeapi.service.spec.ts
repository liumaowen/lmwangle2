import { TestBed, inject } from '@angular/core/testing';

import { YunfeeapiService } from './yunfeeapi.service';

describe('YunfeeapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YunfeeapiService]
    });
  });

  it('should be created', inject([YunfeeapiService], (service: YunfeeapiService) => {
    expect(service).toBeTruthy();
  }));
});
