import { TestBed, inject } from '@angular/core/testing';

import { BusinessorderapiService } from './businessorderapi.service';

describe('BusinessorderapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessorderapiService]
    });
  });

  it('should ...', inject([BusinessorderapiService], (service: BusinessorderapiService) => {
    expect(service).toBeTruthy();
  }));
});
