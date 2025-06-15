import { TestBed } from '@angular/core/testing';

import { MacroSectorService } from './macro-sector.service';

describe('MacroSectorService', () => {
  let service: MacroSectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MacroSectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
