import { TestBed } from '@angular/core/testing';

import { AlineacionService } from './alineacion.service';

describe('AlineacionService', () => {
  let service: AlineacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlineacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
