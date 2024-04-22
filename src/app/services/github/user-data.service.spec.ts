import { TestBed } from '@angular/core/testing';

import { GithubUserDataService } from './user-data.service';

describe('UserDataService', () => {
  let service: GithubUserDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GithubUserDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
