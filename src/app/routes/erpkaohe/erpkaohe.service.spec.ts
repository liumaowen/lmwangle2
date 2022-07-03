/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ErpkaoheService } from './erpkaohe.service';

describe('Service: Erpkaohe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErpkaoheService]
    });
  });

  it('should ...', inject([ErpkaoheService], (service: ErpkaoheService) => {
    expect(service).toBeTruthy();
  }));
});