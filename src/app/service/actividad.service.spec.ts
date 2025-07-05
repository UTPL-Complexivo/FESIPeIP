import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActividadService } from './actividad.service';
import { ActividadModel } from '../models/actividad.model';
import { RespuestaModel } from '../models/respuesta.model';
import { environment } from '../../environments/environment';

describe('ActividadService', () => {
  let service: ActividadService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/actividades`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ActividadService]
    });
    service = TestBed.inject(ActividadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getActividades', () => {
    it('should return an Observable<ActividadModel[]>', (done) => {
      const dummyActividades: ActividadModel[] = [
        { id: 1, codigo: 'ACT001', nombre: 'Actividad 1', estado: 'Activo' },
        { id: 2, codigo: 'ACT002', nombre: 'Actividad 2', estado: 'Activo' }
      ];

      service.getActividades().subscribe(actividades => {
        expect(actividades.length).toBe(2);
        expect(actividades).toEqual(dummyActividades);
        done();
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(dummyActividades);
    });
  });

  describe('CRUD operations', () => {
    it('should get actividad by id', (done) => {
      const dummyActividad: ActividadModel = {
        id: 1, codigo: 'ACT001', nombre: 'Test', estado: 'Activo'
      };

      service.getActividadById(1).subscribe(actividad => {
        expect(actividad).toEqual(dummyActividad);
        done();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyActividad);
    });

    it('should add actividad', (done) => {
      const newActividad: ActividadModel = {
        id: 0, codigo: 'ACT003', nombre: 'Nueva', estado: 'Activo'
      };
      const response: RespuestaModel = { error: false, mensaje: 'Creado exitosamente' };

      service.addActividad(newActividad).subscribe(res => {
        expect(res).toEqual(response);
        done();
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      req.flush(response);
    });

    it('should update actividad', (done) => {
      const actividad: ActividadModel = {
        id: 1, codigo: 'ACT001', nombre: 'Actualizada', estado: 'Activo'
      };
      const response: RespuestaModel = { error: false, mensaje: 'Actualizado exitosamente' };

      service.updateActividad(1, actividad).subscribe(res => {
        expect(res).toEqual(response);
        done();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(response);
    });

    it('should delete actividad', (done) => {
      const motivo = { motivoInactivacion: 'Test deletion' };
      const response: RespuestaModel = { error: false, mensaje: 'Eliminado exitosamente' };

      service.deleteActividad(1, motivo).subscribe(res => {
        expect(res).toEqual(response);
        done();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(response);
    });

    it('should patch estado', (done) => {
      const motivo = { motivoInactivacion: 'Test inactivation' };
      const response: RespuestaModel = { error: false, mensaje: 'Estado actualizado' };

      service.patchActividadEstado(1, motivo).subscribe(res => {
        expect(res).toEqual(response);
        done();
      });

      const req = httpMock.expectOne(`${baseUrl}/1/inactivar`);
      expect(req.request.method).toBe('PATCH');
      req.flush(response);
    });
  });
});
