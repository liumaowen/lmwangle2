import { TestBed, inject } from '@angular/core/testing';

import { NoticeapiService } from './noticeapi.service';

describe('NoticeapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoticeapiService]
    });
  });

  it('should be created', inject([NoticeapiService], (service: NoticeapiService) => {
    expect(service).toBeTruthy();
  }));
});
