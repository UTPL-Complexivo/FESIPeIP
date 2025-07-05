import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MacroSectorService } from './macro-sector.service';
import { MacroSectorModel } from '../models/macro-sector.model';
import { RespuestaModel } from '../models/respuesta.model';
import { environment } from '../../environments/environment';

describe('MacroSectorService', () => {
  let service: MacroSectorService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/macrosectores`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MacroSectorService]
    });
    service = TestBed.inject(MacroSectorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMacroSectores', () => {
    it('should return an Observable<MacroSectorModel[]>', () => {
      const dummyMacroSectores: MacroSectorModel[] = [
        { id: 1, codigo: 'MAC001', nombre: 'Macro Sector 1', estado: 'Activo' },
        { id: 2, codigo: 'MAC002', nombre: 'Macro Sector 2', estado: 'Activo' }
      ];

      service.getMacroSectores().subscribe(macroSectores => {
        expect(macroSectores.length).toBe(2);
        expect(macroSectores).toEqual(dummyMacroSectores);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(dummyMacroSectores);
    });
  });

  describe('getMacroSectorById', () => {
    it('should return an Observable<MacroSectorModel>', () => {
      const dummyMacroSector: MacroSectorModel = {
        id: 1,
        codigo: 'MAC001',
        nombre: 'Macro Sector Test',
        estado: 'Activo'
      };

      service.getMacroSectorById(1).subscribe(macroSector => {
        expect(macroSector).toEqual(dummyMacroSector);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyMacroSector);
    });
  });

  describe('addMacroSector', () => {
    it('should add a macro sector and return a RespuestaModel', () => {
      const newMacroSector: MacroSectorModel = {
        id: 0,
        codigo: 'MAC003',
        nombre: 'Nuevo Macro Sector',
        estado: 'Activo'
      };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'Macro sector creado exitosamente' };

      service.addMacroSector(newMacroSector).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newMacroSector);
      req.flush(dummyResponse);
    });
  });

  describe('updateMacroSector', () => {
    it('should update a macro sector and return a RespuestaModel', () => {
      const updatedMacroSector: MacroSectorModel = {
        id: 1,
        codigo: 'MAC001',
        nombre: 'Macro Sector Actualizado',
        estado: 'Activo'
      };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'Macro sector actualizado exitosamente' };

      service.updateMacroSector(1, updatedMacroSector).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedMacroSector);
      req.flush(dummyResponse);
    });
  });

  describe('deleteMacroSector', () => {
    it('should delete a macro sector and return a RespuestaModel', () => {
      const motivo = { motivoInactivacion: 'Test deletion' };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'Macro sector eliminado exitosamente' };

      service.deleteMacroSector(1, motivo).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual(motivo);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(dummyResponse);
    });
  });

  describe('patchMacroSectorEstado', () => {
    it('should patch the estado of a macro sector and return a RespuestaModel', () => {
      const motivo = { motivoInactivacion: 'Test inactivation' };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'Estado actualizado exitosamente' };

      service.patchMacroSectorEstado(1, motivo).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/1/inactivate`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(motivo);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(dummyResponse);
    });
  });
});
