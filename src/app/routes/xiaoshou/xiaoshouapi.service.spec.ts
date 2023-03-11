import { TestBed, inject } from '@angular/core/testing';

import { XiaoshouapiService } from './xiaoshouapi.service';

describe('XiaoshouapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XiaoshouapiService]
    });
  });

  it('should ...', inject([XiaoshouapiService], (service: XiaoshouapiService) => {
    expect(service).toBeTruthy();
  }));
});
