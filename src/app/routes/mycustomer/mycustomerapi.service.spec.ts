import { TestBed, inject } from '@angular/core/testing';

import { MycustomerapiService } from './mycustomerapi.service';

describe('MycustomerapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MycustomerapiService]
    });
  });

  it('should be created', inject([MycustomerapiService], (service: MycustomerapiService) => {
    expect(service).toBeTruthy();
  }));
});
