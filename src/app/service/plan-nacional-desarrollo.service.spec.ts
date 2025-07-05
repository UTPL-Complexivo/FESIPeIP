import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlanNacionalDesarrolloService } from './plan-nacional-desarrollo.service';
import { PlanNacionalDesarrolloModel } from '../models/plan-nacional-desarrollo.model';
import { RespuestaModel } from '../models/respuesta.model';
import { environment } from '../../environments/environment';

describe('PlanNacionalDesarrolloService', () => {
  let service: PlanNacionalDesarrolloService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/planesnacionalesdesarrollo`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlanNacionalDesarrolloService]
    });
    service = TestBed.inject(PlanNacionalDesarrolloService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPlanesNacionalesDesarrollo', () => {
    it('should return an Observable<PlanNacionalDesarrolloModel[]>', () => {
      const dummyPlanes: PlanNacionalDesarrolloModel[] = [
        { id: 1, codigo: 'PND001', nombre: 'Plan 1', eje: '1', estado: 'Activo', descripcion: 'Descripción 1' },
        { id: 2, codigo: 'PND002', nombre: 'Plan 2', eje: '2', estado: 'Activo', descripcion: 'Descripción 2' }
      ];

      service.getPlanesNacionalesDesarrollo().subscribe(planes => {
        expect(planes.length).toBe(2);
        expect(planes).toEqual(dummyPlanes);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(dummyPlanes);
    });
  });

  describe('getPlanNacionalDesarrolloById', () => {
    it('should return an Observable<PlanNacionalDesarrolloModel>', () => {
      const dummyPlan: PlanNacionalDesarrolloModel = {
        id: 1,
        codigo: 'PND001',
        nombre: 'Plan Test',
        eje: '1',
        estado: 'Activo',
        descripcion: 'Descripción test'
      };

      service.getPlanNacionalDesarrollo(1).subscribe((plan: PlanNacionalDesarrolloModel) => {
        expect(plan).toEqual(dummyPlan);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyPlan);
    });
  });

  describe('addPlanNacionalDesarrollo', () => {
    it('should add a plan and return a RespuestaModel', () => {
      const newPlan: PlanNacionalDesarrolloModel = {
        id: 0,
        codigo: 'PND003',
        nombre: 'Nuevo Plan',
        eje: '1',
        estado: 'Activo',
        descripcion: 'Nueva descripción'
      };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'Plan creado exitosamente' };

      service.addPlanNacionalDesarrollo(newPlan).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPlan);
      req.flush(dummyResponse);
    });
  });

  describe('updatePlanNacionalDesarrollo', () => {
    it('should update a plan and return a RespuestaModel', () => {
      const updatedPlan: PlanNacionalDesarrolloModel = {
        id: 1,
        codigo: 'PND001',
        nombre: 'Plan Actualizado',
        eje: '1',
        estado: 'Activo',
        descripcion: 'Descripción actualizada'
      };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'Plan actualizado exitosamente' };

      service.updatePlanNacionalDesarrollo(1, updatedPlan).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedPlan);
      req.flush(dummyResponse);
    });
  });

  describe('deletePlanNacionalDesarrollo', () => {
    it('should delete a plan and return a RespuestaModel', () => {
      const motivo = { motivoInactivacion: 'Test deletion' };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'Plan eliminado exitosamente' };

      service.deletePlanNacionalDesarrollo(1, motivo).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual(motivo);
      req.flush(dummyResponse);
    });
  });

  describe('patchPlanNacionalDesarrolloEstado', () => {
    it('should patch the estado of a plan and return a RespuestaModel', () => {
      const motivo = { motivoInactivacion: 'Test inactivation' };
      const dummyResponse: RespuestaModel = { error: false, mensaje: 'Estado actualizado exitosamente' };

      service.patchPlanNacionalDesarrolloEstado(1, motivo).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(motivo);
      req.flush(dummyResponse);
    });
  });
});
