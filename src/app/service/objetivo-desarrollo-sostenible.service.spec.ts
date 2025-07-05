import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ObjetivoDesarrolloSostenibleService } from './objetivo-desarrollo-sostenible.service';
import { ObjetivoDesarrolloSostenibleModel } from '../models/objetivo-desarrollo-sostenible.model';
import { RespuestaModel } from '../models/respuesta.model';
import { environment } from '../../environments/environment';

describe('ObjetivoDesarrolloSostenibleService', () => {
  let service: ObjetivoDesarrolloSostenibleService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/objetivosdesarrollosostenibles`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ObjetivoDesarrolloSostenibleService]
    });
    service = TestBed.inject(ObjetivoDesarrolloSostenibleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getObjetivosDesarrolloSostenible', () => {
    it('should return an Observable<ObjetivoDesarrolloSostenibleModel[]>', () => {
      const dummyObjetivos: ObjetivoDesarrolloSostenibleModel[] = [
        { id: 1, codigo: 'ODS001', nombre: 'ODS 1', descripcion: 'Descripción 1', icono: 'icon1.png', estado: 'Activo' },
        { id: 2, codigo: 'ODS002', nombre: 'ODS 2', descripcion: 'Descripción 2', icono: 'icon2.png', estado: 'Activo' }
      ];

      service.getObjetivosDesarrolloSostenible().subscribe(objetivos => {
        expect(objetivos.length).toBe(2);
        expect(objetivos).toEqual(dummyObjetivos);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(dummyObjetivos);
    });
  });

  describe('getObjetivoDesarrolloSostenible', () => {
    it('should return an Observable<ObjetivoDesarrolloSostenibleModel>', () => {
      const dummyObjetivo: ObjetivoDesarrolloSostenibleModel = {
        id: 1,
        codigo: 'ODS001',
        nombre: 'ODS Test',
        descripcion: 'Descripción test',
        icono: 'icon-test.png',
        estado: 'Activo'
      };

      service.getObjetivoDesarrolloSostenible(1).subscribe(objetivo => {
        expect(objetivo).toEqual(dummyObjetivo);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyObjetivo);
    });
  });

  describe('addObjetivoDesarrolloSostenible', () => {
    it('should add an objetivo and return a RespuestaModel', () => {
      const newObjetivo: ObjetivoDesarrolloSostenibleModel = {
        id: 0,
        codigo: 'ODS003',
        nombre: 'Nuevo ODS',
        descripcion: 'Nueva descripción',
        icono: 'new-icon.png',
        estado: 'Activo'
      };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'ODS creado exitosamente' };

      service.addObjetivoDesarrolloSostenible(newObjetivo).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newObjetivo);
      req.flush(dummyResponse);
    });
  });

  describe('updateObjetivoDesarrolloSostenible', () => {
    it('should update an objetivo and return a RespuestaModel', () => {
      const updatedObjetivo: ObjetivoDesarrolloSostenibleModel = {
        id: 1,
        codigo: 'ODS001',
        nombre: 'ODS Actualizado',
        descripcion: 'Descripción actualizada',
        icono: 'updated-icon.png',
        estado: 'Activo'
      };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'ODS actualizado exitosamente' };

      service.updateObjetivoDesarrolloSostenible(1, updatedObjetivo).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedObjetivo);
      req.flush(dummyResponse);
    });
  });

  describe('deleteObjetivoDesarrolloSostenible', () => {
    it('should delete an objetivo and return a RespuestaModel', () => {
      const motivo = { estado: 'Inactivo', motivo: 'Test deletion' };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'ODS eliminado exitosamente' };

      service.deleteObjetivoDesarrolloSostenible(1, motivo).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual(motivo);
      req.flush(dummyResponse);
    });
  });

  describe('patchObjetivoDesarrolloSostenibleEstado', () => {
    it('should patch the estado of an objetivo and return a RespuestaModel', () => {
      const motivo = { estado: 'Inactivo', motivo: 'Test inactivation' };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'Estado actualizado exitosamente' };

      service.patchObjetivoDesarrolloSostenibleEstado(1, motivo).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(motivo);
      req.flush(dummyResponse);
    });
  });
});
