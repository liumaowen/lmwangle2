/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChengbenService } from './chengben.service';

describe('Service: Chengben', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChengbenService]
    });
  });

  it('should ...', inject([ChengbenService], (service: ChengbenService) => {
    expect(service).toBeTruthy();
  }));
});
