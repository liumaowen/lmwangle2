import { TestBed, inject } from '@angular/core/testing';

import { ProorderapiService } from './proorderapi.service';

describe('ProorderapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProorderapiService]
    });
  });

  it('should ...', inject([ProorderapiService], (service: ProorderapiService) => {
    expect(service).toBeTruthy();
  }));
});
