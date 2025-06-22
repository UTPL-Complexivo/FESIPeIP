import { TestBed } from '@angular/core/testing';

import { ObjetivoInstitucionalService } from './objetivo-institucional.service';

describe('ObjetivoInstitucionalService', () => {
  let service: ObjetivoInstitucionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjetivoInstitucionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
