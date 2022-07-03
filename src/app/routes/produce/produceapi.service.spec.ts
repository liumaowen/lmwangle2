import { TestBed, inject } from '@angular/core/testing';

import { ProduceapiService } from './produceapi.service';

describe('ProduceapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProduceapiService]
    });
  });

  it('should ...', inject([ProduceapiService], (service: ProduceapiService) => {
    expect(service).toBeTruthy();
  }));
});
