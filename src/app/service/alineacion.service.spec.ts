import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AlineacionService } from './alineacion.service';
import { AlineacionModel } from '../models/alineacion.model';
import { RespuestaModel } from '../models/respuesta.model';
import { environment } from '../../environments/environment';

describe('AlineacionService', () => {
  let service: AlineacionService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/alineaciones`;

  const mockAlineacion: AlineacionModel = {
    id: 1,
    objetivoDesarrolloSostenibleId: 1,
    objetivoInstitucionalId: 1,
    planNacionalDesarrolloId: 1,
    nombreODS: 'ODS Test',
    iconoODS: 'icono-test',
    nombreOI: 'OI Test',
    nombrePND: 'PND Test'
  };

  const mockRespuesta: RespuestaModel = {
    error: false,
    mensaje: 'Operación exitosa',
    data: mockAlineacion
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlineacionService]
    });
    service = TestBed.inject(AlineacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAlineaciones', () => {
    it('should return an Observable<AlineacionModel[]>', () => {
      const mockAlineaciones: AlineacionModel[] = [mockAlineacion];

      service.getAlineaciones().subscribe(alineaciones => {
        expect(alineaciones).toEqual(mockAlineaciones);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockAlineaciones);
    });
  });

  describe('getAlineacionById', () => {
    it('should return an Observable<AlineacionModel>', () => {
      const id = 1;

      service.getAlineacionById(id).subscribe(alineacion => {
        expect(alineacion).toEqual(mockAlineacion);
      });

      const req = httpMock.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAlineacion);
    });
  });

  describe('addAlineacion', () => {
    it('should return an Observable<RespuestaModel>', () => {
      service.addAlineacion(mockAlineacion).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockAlineacion);
      req.flush(mockRespuesta);
    });
  });

  describe('addMultiplesAlineaciones', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const mockAlineaciones: AlineacionModel[] = [mockAlineacion];

      service.addMultiplesAlineaciones(mockAlineaciones).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${baseUrl}/multiples`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockAlineaciones);
      req.flush(mockRespuesta);
    });
  });

  describe('updateAlineacion', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = 1;

      service.updateAlineacion(id, mockAlineacion).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockAlineacion);
      req.flush(mockRespuesta);
    });
  });

  describe('deleteAlineacion', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = 1;
      const motivo = { motivoInactivacion: 'Test deletion' };

      service.deleteAlineacion(id, motivo).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual(motivo);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockRespuesta);
    });
  });
});
