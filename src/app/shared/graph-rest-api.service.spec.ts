import { TestBed } from '@angular/core/testing';

import { GraphRestApiService } from './graph-rest-api.service';

describe('GraphRestApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphRestApiService = TestBed.get(GraphRestApiService);
    expect(service).toBeTruthy();
  });
});
