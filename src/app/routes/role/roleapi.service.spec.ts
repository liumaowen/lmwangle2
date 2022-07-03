import { TestBed, inject } from '@angular/core/testing';

import { RoleapiService } from './roleapi.service';

describe('RoleapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleapiService]
    });
  });

  it('should be created', inject([RoleapiService], (service: RoleapiService) => {
    expect(service).toBeTruthy();
  }));
});
