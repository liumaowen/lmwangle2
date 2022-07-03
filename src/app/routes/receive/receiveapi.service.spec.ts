import { TestBed, inject } from '@angular/core/testing';

import { ReceiveapiService } from './receiveapi.service';

describe('ReceiveapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReceiveapiService]
    });
  });

  it('should ...', inject([ReceiveapiService], (service: ReceiveapiService) => {
    expect(service).toBeTruthy();
  }));
});
