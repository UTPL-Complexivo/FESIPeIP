import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService } from './usuario.service';
import { UsuarioModel } from '../models/usuario.model';
import { RespuestaModel } from '../models/respuesta.model';
import { environment } from '../../environments/environment';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/usuarios`;

  const mockUsuario: UsuarioModel = {
    id: '1',
    correo: 'test@example.com',
    nombre: 'Usuario Test',
    telefono: '1234567890',
    avatarUrl: 'https://example.com/avatar.jpg',
    userName: 'usuario_test',
    tipoUsuario: 'Admin',
    roles: ['Administrador'],
    estado: 'Activo',
    eliminado: false,
    primerNombre: 'Usuario',
    segundoNombre: 'Test'
  };

  const mockRespuesta: RespuestaModel = {
    error: false,
    mensaje: 'Operación exitosa',
    data: mockUsuario
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService]
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsuarios', () => {
    it('should return an Observable<UsuarioModel[]>', () => {
      const mockUsuarios: UsuarioModel[] = [mockUsuario];

      service.getUsuarios().subscribe(usuarios => {
        expect(usuarios).toEqual(mockUsuarios);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuarios);
    });
  });

  describe('getUsuario', () => {
    it('should return an Observable<UsuarioModel>', () => {
      const id = '1';

      service.getUsuario(id).subscribe(usuario => {
        expect(usuario).toEqual(mockUsuario);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuario);
    });
  });

  describe('getMe', () => {
    it('should return an Observable<UsuarioModel>', () => {
      service.getMe().subscribe(usuario => {
        expect(usuario).toEqual(mockUsuario);
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuario);
    });
  });

  describe('addUsuario', () => {
    it('should return an Observable<RespuestaModel>', () => {
      service.addUsuario(mockUsuario).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUsuario);
      req.flush(mockRespuesta);
    });
  });

  describe('putUsuario', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = '1';

      service.putUsuario(id, mockUsuario).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockUsuario);
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

  describe('patchResetPassword', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = '1';

      service.patchResetPassword(id).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}/reset-password`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush(mockRespuesta);
    });
  });

  describe('deleteUsuario', () => {
    it('should return an Observable<RespuestaModel>', () => {
      const id = '1';

      service.deleteUsuario(id).subscribe(respuesta => {
        expect(respuesta).toEqual(mockRespuesta);
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockRespuesta);
    });
  });
});
