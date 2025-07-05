import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SubSectorService } from './sub-sector.service';
import { SubSectorModel } from '../models/sub-sector.model';
import { RespuestaModel } from '../models/respuesta.model';
import { environment } from '../../environments/environment';

describe('SubSectorService', () => {
  let service: SubSectorService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/subsectores`;

  const mockSubSector: SubSectorModel = {
    id: 1,
    codigo: 'SUB001',
    nombre: 'Sub Sector de Prueba',
    macroSectorId: 1,
    nombreMacroSector: 'Macro Sector de Prueba',
    sectorId: 1,
    nombreSector: 'Sector de Prueba',
    estado: 'Activo'
  };

  const mockRespuesta: RespuestaModel = {
    error: false,
    mensaje: 'Operación exitosa',
    data: mockSubSector
  };

  const mockMotivo = {
    motivo: 'Motivo de prueba para inactivación'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubSectorService]
    });
    service = TestBed.inject(SubSectorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSubsectores', () => {
    it('should return an Observable<SubSectorModel[]>', () => {
      const mockSubSectores: SubSectorModel[] = [mockSubSector];

      service.getSubsectores().subscribe(subsectores => {
        expect(subsectores).toEqual(mockSubSectores);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockSubSectores);
    });
  });

  describe('getSubsectoresById', () => {
    it('should return an Observable<SubSectorModel>', () => {
      const id = 1;

      service.getSubsectoresById(id).subscribe(subsector => {
        expect(subsector).toEqual(mockSubSector);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSubSector);
    });
  });

  describe('addSubSector', () => {
    it('should return an Observable<RespuestaModel>', () => {
      service.addSubSector(mockSubSector).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockSubSector);
      req.flush(mockRespuesta);
    });
  });

  describe('updateSubSector', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = 1;

      service.updateSubSector(id, mockSubSector).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockSubSector);
      req.flush(mockRespuesta);
    });
  });

  describe('patchSubSectorEstado', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = 1;

      service.patchSubSectorEstado(id, mockMotivo).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}/inactivate`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockMotivo);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockRespuesta);
    });
  });

  describe('deleteSubSector', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = 1;

      service.deleteSubSector(id, mockMotivo).subscribe(respuesta => {
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
