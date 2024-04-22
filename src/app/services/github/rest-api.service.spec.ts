import { TestBed } from '@angular/core/testing';

import { GithubRestApiService } from './rest-api.service';

describe('RestApiService', () => {
  let service: GithubRestApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GithubRestApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
