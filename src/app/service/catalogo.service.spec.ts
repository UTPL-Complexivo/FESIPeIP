import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CatalogoService } from './catalogo.service';
import { CatalogoModel } from '../models/catalogo.model';
import { environment } from '../../environments/environment';

describe('CatalogoService', () => {
  let service: CatalogoService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/catalogos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CatalogoService]
    });
    service = TestBed.inject(CatalogoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCatalogosByTipo', () => {
    it('should return an Observable<CatalogoModel[]>', () => {
      const tipo = 1;
      const dummyCatalogos: CatalogoModel[] = [
        { id: 1, tipo: 1, nombre: 'Catálogo 1', valor: 'valor1', nombreTipo: 'Tipo 1' },
        { id: 2, tipo: 1, nombre: 'Catálogo 2', valor: 'valor2', nombreTipo: 'Tipo 1' }
      ];

      service.getCatalogosByTipo(tipo).subscribe(catalogos => {
        expect(catalogos.length).toBe(2);
        expect(catalogos).toEqual(dummyCatalogos);
      });

      const req = httpMock.expectOne(`${baseUrl}/tipo/${tipo}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyCatalogos);
    });

    it('should handle different tipos', () => {
      const tipo = 2;
      const dummyCatalogos: CatalogoModel[] = [
        { id: 3, tipo: 2, nombre: 'Catálogo 3', valor: 'valor3', nombreTipo: 'Tipo 2' }
      ];

      service.getCatalogosByTipo(tipo).subscribe(catalogos => {
        expect(catalogos.length).toBe(1);
        expect(catalogos[0].tipo).toBe(tipo);
      });

      const req = httpMock.expectOne(`${baseUrl}/tipo/${tipo}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyCatalogos);
    });
  });
});
