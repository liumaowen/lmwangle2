import { TestBed, inject } from '@angular/core/testing';

import { CustomerapiService } from './customerapi.service';

describe('CustomerapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerapiService]
    });
  });

  it('should ...', inject([CustomerapiService], (service: CustomerapiService) => {
    expect(service).toBeTruthy();
  }));
});
