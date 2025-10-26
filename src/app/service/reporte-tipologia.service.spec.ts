import { TestBed } from '@angular/core/testing';

import { ReporteTipologiaService } from './reporte-tipologia.service';

describe('ReporteTipologiaService', () => {
  let service: ReporteTipologiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteTipologiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
