import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipologiaActividadService } from './tipologia-actividad.service';
import { TipologiaActividadModel } from '../models/tipologia-actividad.model';
import { RespuestaModel } from '../models/respuesta.model';
import { environment } from '../../environments/environment';

describe('TipologiaActividadService', () => {
  let service: TipologiaActividadService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/tipologiasactividades`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipologiaActividadService]
    });
    service = TestBed.inject(TipologiaActividadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTipologiasActividades', () => {
    it('should return an Observable<TipologiaActividadModel[]>', (done) => {
      const dummyTipologiasActividades: TipologiaActividadModel[] = [
        {
          id: 1,
          tipologiaId: 1,
          actividadId: 1,
          tipologiaNombre: 'Tipología 1',
          actividadNombre: 'Actividad 1',
          tipologiaCodigo: 'TIP001'
        },
        {
          id: 2,
          tipologiaId: 2,
          actividadId: 2,
          tipologiaNombre: 'Tipología 2',
          actividadNombre: 'Actividad 2',
          tipologiaCodigo: 'TIP002'
        }
      ];

      service.getTipologiasActividades().subscribe(tipologiasActividades => {
        expect(tipologiasActividades.length).toBe(2);
        expect(tipologiasActividades).toEqual(dummyTipologiasActividades);
        done();
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(dummyTipologiasActividades);
    });
  });

  describe('CRUD operations', () => {
    it('should get tipologia-actividad by id', (done) => {
      const dummyTipologiaActividad: TipologiaActividadModel = {
        id: 1,
        tipologiaId: 1,
        actividadId: 1,
        tipologiaNombre: 'Test Tipología',
        actividadNombre: 'Test Actividad',
        tipologiaCodigo: 'TEST001'
      };

      service.getTipologiaActividadById(1).subscribe(tipologiaActividad => {
        expect(tipologiaActividad).toEqual(dummyTipologiaActividad);
        done();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyTipologiaActividad);
    });

    it('should add tipologia-actividad', (done) => {
      const newTipologiaActividad: TipologiaActividadModel = {
        id: 0,
        tipologiaId: 1,
        actividadId: 1,
        tipologiaNombre: 'Nueva Tipología',
        actividadNombre: 'Nueva Actividad',
        tipologiaCodigo: 'NEW001'
      };
      const response: RespuestaModel = { error: false, mensaje: 'Creado exitosamente' };

      service.addTipologiaActividad(newTipologiaActividad).subscribe(res => {
        expect(res).toEqual(response);
        done();
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      req.flush(response);
    });

    it('should update tipologia-actividad', (done) => {
      const tipologiaActividad: TipologiaActividadModel = {
        id: 1,
        tipologiaId: 1,
        actividadId: 2,
        tipologiaNombre: 'Tipología Actualizada',
        actividadNombre: 'Actividad Actualizada',
        tipologiaCodigo: 'UPD001'
      };
      const response: RespuestaModel = { error: false, mensaje: 'Actualizado exitosamente' };

      service.updateTipologiaActividad(1, tipologiaActividad).subscribe(res => {
        expect(res).toEqual(response);
        done();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(response);
    });

    it('should delete tipologia-actividad', (done) => {
      const response: RespuestaModel = { error: false, mensaje: 'Eliminado exitosamente' };

      service.deleteTipologiaActividad(1).subscribe(res => {
        expect(res).toEqual(response);
        done();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(response);
    });
  });
});
