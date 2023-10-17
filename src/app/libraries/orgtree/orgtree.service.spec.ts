import { TestBed } from '@angular/core/testing';

import { OrgtreeService } from './orgtree.service';

describe('OrgtreeService', () => {
  let service: OrgtreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgtreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
