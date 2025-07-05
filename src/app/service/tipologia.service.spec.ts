import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipologiaService } from './tipologia.service';
import { TipologiaModel } from '../models/tipologia.model';
import { RespuestaModel } from '../models/respuesta.model';
import { environment } from '../../environments/environment';

describe('TipologiaService', () => {
  let service: TipologiaService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/tipologias`;

  const mockTipologia: TipologiaModel = {
    id: 1,
    nombre: 'Tipología de Prueba',
    descripcion: 'Descripción de tipología de prueba',
    estado: 'Activo',
    codigo: 'TIP001'
  };

  const mockRespuesta: RespuestaModel = {
    error: false,
    mensaje: 'Operación exitosa',
    data: mockTipologia
  };

  const mockMotivo = {
    motivo: 'Motivo de prueba para inactivación'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipologiaService]
    });
    service = TestBed.inject(TipologiaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTipologias', () => {
    it('should return an Observable<TipologiaModel[]>', () => {
      const mockTipologias: TipologiaModel[] = [mockTipologia];

      service.getTipologias().subscribe(tipologias => {
        expect(tipologias).toEqual(mockTipologias);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockTipologias);
    });
  });

  describe('getTipologiaById', () => {
    it('should return an Observable<TipologiaModel>', () => {
      const id = 1;

      service.getTipologiaById(id).subscribe(tipologia => {
        expect(tipologia).toEqual(mockTipologia);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTipologia);
    });
  });

  describe('addTipologia', () => {
    it('should return an Observable<RespuestaModel>', () => {
      service.addTipologia(mockTipologia).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockTipologia);
      req.flush(mockRespuesta);
    });
  });

  describe('updateTipologia', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = 1;

      service.updateTipologia(id, mockTipologia).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockTipologia);
      req.flush(mockRespuesta);
    });
  });

  describe('patchTipologiaEstado', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = 1;

      service.patchTipologiaEstado(id, mockMotivo).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}/inactivar`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockMotivo);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockRespuesta);
    });
  });

  describe('deleteTipologia', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = 1;

      service.deleteTipologia(id, mockMotivo).subscribe(respuesta => {
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
