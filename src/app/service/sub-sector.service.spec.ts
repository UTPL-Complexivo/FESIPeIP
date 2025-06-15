import { TestBed } from '@angular/core/testing';

import { SubSectorService } from './sub-sector.service';

describe('SubSectorService', () => {
  let service: SubSectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubSectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
