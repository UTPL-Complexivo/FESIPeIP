import { TestBed } from '@angular/core/testing';

import { ObjetivoDesarrolloSostenibleService } from './objetivo-desarrollo-sostenible.service';

describe('ObjetivoDesarrolloSostenibleService', () => {
  let service: ObjetivoDesarrolloSostenibleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjetivoDesarrolloSostenibleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
