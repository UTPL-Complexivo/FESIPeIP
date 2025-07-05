import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SectorService } from './sector.service';
import { SectorModel } from '../models/sector.model';
import { RespuestaModel } from '../models/respuesta.model';
import { environment } from '../../environments/environment';

describe('SectorService', () => {
  let service: SectorService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/sectores`;

  const mockSector: SectorModel = {
    id: 1,
    codigo: 'SEC001',
    nombre: 'Sector de Prueba',
    macroSectorId: 1,
    nombreMacroSector: 'Macro Sector de Prueba',
    estado: 'Activo'
  };

  const mockRespuesta: RespuestaModel = {
    error: false,
    mensaje: 'Operación exitosa',
    data: mockSector
  };

  const mockMotivo = {
    motivo: 'Motivo de prueba para inactivación'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SectorService]
    });
    service = TestBed.inject(SectorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSectores', () => {
    it('should return an Observable<SectorModel[]>', () => {
      const mockSectores: SectorModel[] = [mockSector];

      service.getSectores().subscribe(sectores => {
        expect(sectores).toEqual(mockSectores);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockSectores);
    });
  });

  describe('getSectoresByMacroSectorId', () => {
    it('should return an Observable<SectorModel[]>', () => {
      const macroSectorId = 1;
      const mockSectores: SectorModel[] = [mockSector];

      service.getSectoresByMacroSectorId(macroSectorId).subscribe(sectores => {
        expect(sectores).toEqual(mockSectores);
      });

      const req = httpMock.expectOne(`${apiUrl}/${macroSectorId}/macrosector`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSectores);
    });
  });

  describe('getSectorById', () => {
    it('should return an Observable<SectorModel>', () => {
      const id = 1;

      service.getSectorById(id).subscribe(sector => {
        expect(sector).toEqual(mockSector);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSector);
    });
  });

  describe('addSector', () => {
    it('should return an Observable<RespuestaModel>', () => {
      service.addSector(mockSector).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockSector);
      req.flush(mockRespuesta);
    });
  });

  describe('updateSector', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = 1;

      service.updateSector(id, mockSector).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockSector);
      req.flush(mockRespuesta);
    });
  });

  describe('patchEstado', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = 1;

      service.patchEstado(id, mockMotivo).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}/inactivate`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockMotivo);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockRespuesta);
    });
  });

  describe('deleteSector', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = 1;

      service.deleteSector(id, mockMotivo).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual(mockMotivo);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockRespuesta);
    });
  });
});
