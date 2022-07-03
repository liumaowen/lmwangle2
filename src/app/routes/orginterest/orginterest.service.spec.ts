import { TestBed, inject } from '@angular/core/testing';

import { OrginterestService } from './orginterest.service';

describe('OrginterestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrginterestService]
    });
  });

  it('should ...', inject([OrginterestService], (service: OrginterestService) => {
    expect(service).toBeTruthy();
  }));
});
