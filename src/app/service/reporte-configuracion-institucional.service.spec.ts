import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReporteConfiguracionInstitucionalService } from './reporte-configuracion-institucional.service';
import { FiltroMacroSectorModel } from '../models/filtro-macro-sector.model';
import { ReporteMacroSectorModel } from '../models/reporte-macrosector.model';

describe('ReporteConfiguracionInstitucionalService', () => {
  let service: ReporteConfiguracionInstitucionalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReporteConfiguracionInstitucionalService]
    });
    service = TestBed.inject(ReporteConfiguracionInstitucionalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get data with filters', () => {
    const mockData: ReporteMacroSectorModel[] = [
      {
        nombre: 'Macro Sector Test',
        sectores: [
          {
            nombre: 'Sector Test',
            subsectores: [
              {
                nombre: 'Subsector Test',
                instituciones: [
                  {
                    nombre: 'Institución Test',
                    estado: 'Activo'
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    const filtro: FiltroMacroSectorModel = {
      nombreMacroSector: 'Test'
    };

    service.getData(filtro).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/json`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filtro);
    req.flush(mockData);
  });

  it('should export to PDF', () => {
    const mockBlob = new Blob(['test'], { type: 'application/pdf' });
    const filtro: FiltroMacroSectorModel = {
      nombreMacroSector: 'Test'
    };

    service.exportToPDF(filtro).subscribe(blob => {
      expect(blob).toEqual(mockBlob);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/pdf`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filtro);
    req.flush(mockBlob);
  });

  it('should export to Excel', () => {
    const mockBlob = new Blob(['test'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const filtro: FiltroMacroSectorModel = {
      nombreMacroSector: 'Test'
    };

    service.exportToExcel(filtro).subscribe(blob => {
      expect(blob).toEqual(mockBlob);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/excel`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filtro);
    req.flush(mockBlob);
  });

  it('should export to JSON', () => {
    const mockData: ReporteMacroSectorModel[] = [
      {
        nombre: 'Macro Sector Test',
        sectores: []
      }
    ];

    const filtro: FiltroMacroSectorModel = {
      nombreMacroSector: 'Test'
    };

    service.exportToJSON(filtro).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/json`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filtro);
    req.flush(mockData);
  });
});
