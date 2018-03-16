import { TestBed, inject } from '@angular/core/testing';

import { LocalStringStorageService } from './local-string-storage.service';

describe('LocalStringStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStringStorageService]
    });
  });

  it('should be created', inject([LocalStringStorageService], (service: LocalStringStorageService) => {
    expect(service).toBeTruthy();
  }));
});
