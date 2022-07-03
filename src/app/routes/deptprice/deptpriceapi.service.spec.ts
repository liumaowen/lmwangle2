import { TestBed, inject } from '@angular/core/testing';

import { DeptpriceapiService } from './deptpriceapi.service';

describe('DeptpriceapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeptpriceapiService]
    });
  });

  it('should be created', inject([DeptpriceapiService], (service: DeptpriceapiService) => {
    expect(service).toBeTruthy();
  }));
});
