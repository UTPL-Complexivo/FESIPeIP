import { TestBed } from '@angular/core/testing';

import { ReporteObjetivoEstrategicoService } from './reporte-objetivo-estrategico.service';

describe('ReporteObjetivoEstrategicoService', () => {
  let service: ReporteObjetivoEstrategicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteObjetivoEstrategicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
