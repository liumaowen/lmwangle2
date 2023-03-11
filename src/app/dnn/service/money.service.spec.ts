import { TestBed, inject } from '@angular/core/testing';

import { MoneyService } from './money.service';

describe('MoneyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MoneyService]
    });
  });

  it('should ...', inject([MoneyService], (service: MoneyService) => {
    expect(service).toBeTruthy();
  }));
});
