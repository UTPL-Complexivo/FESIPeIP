import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RolService } from './rol.service';
import { RolModel } from '../models/rol.model';
import { RespuestaModel } from '../models/respuesta.model';
import { environment } from '../../environments/environment';

describe('RolService', () => {
  let service: RolService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/roles`;

  const mockRol: RolModel = {
    id: '1',
    nombre: 'Administrador',
    descripcion: 'Rol de administrador del sistema',
    estado: 'Activo'
  };

  const mockRespuesta: RespuestaModel = {
    error: false,
    mensaje: 'Operación exitosa',
    data: mockRol
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RolService]
    });
    service = TestBed.inject(RolService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRoles', () => {
    it('should return an Observable<RolModel[]>', () => {
      const mockRoles: RolModel[] = [mockRol];

      service.getRoles().subscribe(roles => {
        expect(roles).toEqual(mockRoles);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockRoles);
    });
  });

  describe('getRol', () => {
    it('should return an Observable<RolModel>', () => {
      const id = '1';

      service.getRol(id).subscribe(rol => {
        expect(rol).toEqual(mockRol);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRol);
    });
  });

  describe('addRol', () => {
    it('should return an Observable<RespuestaModel>', () => {
      service.addRol(mockRol).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRol);
      req.flush(mockRespuesta);
    });
  });

  describe('updateRol', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = '1';

      service.updateRol(id, mockRol).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockRol);
      req.flush(mockRespuesta);
    });
  });

  describe('patchEstado', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = '1';

      service.patchEstado(id).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}/inactivate`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush(mockRespuesta);
    });
  });

  describe('deleteRol', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = '1';

      service.deleteRol(id).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockRespuesta);
    });
  });
});
