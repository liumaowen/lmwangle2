import { TestBed, inject } from '@angular/core/testing';

import { InnersaleapiService } from './innersaleapi.service';

describe('InnersaleapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InnersaleapiService]
    });
  });

  it('should ...', inject([InnersaleapiService], (service: InnersaleapiService) => {
    expect(service).toBeTruthy();
  }));
});
