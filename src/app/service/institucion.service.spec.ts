import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InstitucionService } from './institucion.service';
import { InstitucionModel } from '../models/institucion.model';
import { RespuestaModel } from '../models/respuesta.model';
import { environment } from '../../environments/environment';

describe('InstitucionService', () => {
  let service: InstitucionService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/entidadesestado`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InstitucionService]
    });
    service = TestBed.inject(InstitucionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getInstituciones', () => {
    it('should return an Observable<InstitucionModel[]>', () => {
      const dummyInstituciones: InstitucionModel[] = [
        {
          id: 1,
          nombre: 'Institución 1',
          codigo: 'INST001',
          estado: 'Activo',
          subsectorId: 1,
          nombreSubsector: 'Subsector 1',
          nombreSector: 'Sector 1',
          nombreMacroSector: 'Macro 1',
          direccion: 'Dirección 1',
          telefono: '123456789',
          correo: 'inst1@test.com',
          nivelGobierno: 'Nacional'
        },
        {
          id: 2,
          nombre: 'Institución 2',
          codigo: 'INST002',
          estado: 'Activo',
          subsectorId: 2,
          nombreSubsector: 'Subsector 2',
          nombreSector: 'Sector 2',
          nombreMacroSector: 'Macro 2',
          direccion: 'Dirección 2',
          telefono: '987654321',
          correo: 'inst2@test.com',
          nivelGobierno: 'Regional'
        }
      ];

      service.getInstituciones().subscribe(instituciones => {
        expect(instituciones.length).toBe(2);
        expect(instituciones).toEqual(dummyInstituciones);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(dummyInstituciones);
    });
  });

  describe('getInstitucionById', () => {
    it('should return an Observable<InstitucionModel>', () => {
      const dummyInstitucion: InstitucionModel = {
        id: 1,
        nombre: 'Institución Test',
        codigo: 'INST001',
        estado: 'Activo',
        subsectorId: 1,
        nombreSubsector: 'Subsector Test',
        nombreSector: 'Sector Test',
        nombreMacroSector: 'Macro Test',
        direccion: 'Dirección Test',
        telefono: '123456789',
        correo: 'test@inst.com',
        nivelGobierno: 'Nacional'
      };

      service.getInstitucionById(1).subscribe(institucion => {
        expect(institucion).toEqual(dummyInstitucion);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyInstitucion);
    });
  });

  describe('addInstitucion', () => {
    it('should add an institucion and return a RespuestaModel', () => {
      const newInstitucion: InstitucionModel = {
        id: 0,
        nombre: 'Nueva Institución',
        codigo: 'INST003',
        estado: 'Activo',
        subsectorId: 1,
        nombreSubsector: 'Nuevo Subsector',
        nombreSector: 'Nuevo Sector',
        nombreMacroSector: 'Nuevo Macro',
        direccion: 'Nueva Dirección',
        telefono: '111222333',
        correo: 'nueva@inst.com',
        nivelGobierno: 'Local'
      };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'Institución creada exitosamente' };

      spyOn(console, 'log');

      service.addInstitucion(newInstitucion).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      expect(console.log).toHaveBeenCalledWith('Adding institution:', newInstitucion);

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      req.flush(dummyResponse);
    });
  });

  describe('updateInstitucion', () => {
    it('should update an institucion and return a RespuestaModel', () => {
      const updatedInstitucion: InstitucionModel = {
        id: 1,
        nombre: 'Institución Actualizada',
        codigo: 'INST001',
        estado: 'Activo',
        subsectorId: 1,
        nombreSubsector: 'Subsector Actualizado',
        nombreSector: 'Sector Actualizado',
        nombreMacroSector: 'Macro Actualizado',
        direccion: 'Dirección Actualizada',
        telefono: '444555666',
        correo: 'actualizada@inst.com',
        nivelGobierno: 'Nacional'
      };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'Institución actualizada exitosamente' };

      spyOn(console, 'log');

      service.updateInstitucion(1, updatedInstitucion).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      expect(console.log).toHaveBeenCalledWith('Updating institution:', updatedInstitucion);

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(dummyResponse);
    });
  });

  describe('patchEstadoInstitucion', () => {
    it('should patch the estado of an institucion and return a RespuestaModel', () => {
      const motivo = { motivoInactivacion: 'Test inactivation' };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'Estado actualizado exitosamente' };

      service.patchEstadoInstitucion(1, motivo).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/1/inactivate`);
      expect(req.request.method).toBe('PATCH');
      req.flush(dummyResponse);
    });
  });

  describe('deleteInstitucion', () => {
    it('should delete an institucion and return a RespuestaModel', () => {
      const motivo = { motivoInactivacion: 'Test deletion' };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'Institución eliminada exitosamente' };

      service.deleteInstitucion(1, motivo).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(dummyResponse);
    });
  });
});
