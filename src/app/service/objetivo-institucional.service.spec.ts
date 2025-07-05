import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ObjetivoInstitucionalService } from './objetivo-institucional.service';
import { ObjetivoInstitucionalModel } from '../models/objetivo-institucional.model';
import { RespuestaModel } from '../models/respuesta.model';
import { DeleteModel } from '../models/delete.model';
import { environment } from '../../environments/environment';

describe('ObjetivoInstitucionalService', () => {
  let service: ObjetivoInstitucionalService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/objetivosinstitucionales`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ObjetivoInstitucionalService]
    });
    service = TestBed.inject(ObjetivoInstitucionalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getObjetivosInstitucionales', () => {
    it('should return an Observable<ObjetivoInstitucionalModel[]>', (done) => {
      const dummyObjetivos: ObjetivoInstitucionalModel[] = [
        { id: 1, codigo: 'OI001', nombre: 'Objetivo 1', descripcion: 'Desc 1', estado: 'Activo' },
        { id: 2, codigo: 'OI002', nombre: 'Objetivo 2', descripcion: 'Desc 2', estado: 'Activo' }
      ];

      service.getObjetivosInstitucionales().subscribe(objetivos => {
        expect(objetivos.length).toBe(2);
        expect(objetivos).toEqual(dummyObjetivos);
        done();
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(dummyObjetivos);
    });
  });

  describe('CRUD operations', () => {
    it('should get objetivo by id', (done) => {
      const dummyObjetivo: ObjetivoInstitucionalModel = {
        id: 1, codigo: 'OI001', nombre: 'Test', descripcion: 'Test desc', estado: 'Activo'
      };

      service.getObjetivoInstitucional(1).subscribe(objetivo => {
        expect(objetivo).toEqual(dummyObjetivo);
        done();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyObjetivo);
    });

    it('should add objetivo', (done) => {
      const newObjetivo: ObjetivoInstitucionalModel = {
        id: 0, codigo: 'OI003', nombre: 'Nuevo', descripcion: 'Nueva desc', estado: 'Activo'
      };
      const response: RespuestaModel = { error: false, mensaje: 'Creado exitosamente' };

      service.addObjetivoInstitucional(newObjetivo).subscribe(res => {
        expect(res).toEqual(response);
        done();
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      req.flush(response);
    });

    it('should update objetivo', (done) => {
      const objetivo: ObjetivoInstitucionalModel = {
        id: 1, codigo: 'OI001', nombre: 'Actualizado', descripcion: 'Desc actualizada', estado: 'Activo'
      };
      const response: RespuestaModel = { error: false, mensaje: 'Actualizado exitosamente' };

      service.updateObjetivoInstitucional(1, objetivo).subscribe(res => {
        expect(res).toEqual(response);
        done();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(response);
    });

    it('should delete objetivo', (done) => {
      const motivo: DeleteModel = { id: 1, motivoInactivacion: 'Test deletion' };
      const response: RespuestaModel = { error: false, mensaje: 'Eliminado exitosamente' };

      service.deleteObjetivoInstitucional(1, motivo).subscribe(res => {
        expect(res).toEqual(response);
        done();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(response);
    });

    it('should patch estado', (done) => {
      const motivo: DeleteModel = { id: 1, motivoInactivacion: 'Test inactivation' };
      const response: RespuestaModel = { error: false, mensaje: 'Estado actualizado' };

      service.patchObjetivoInstitucionalEstado(1, motivo).subscribe(res => {
        expect(res).toEqual(response);
        done();
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PATCH');
      req.flush(response);
    });
  });
});
