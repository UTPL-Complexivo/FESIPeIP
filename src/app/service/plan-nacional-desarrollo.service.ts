import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanNacionalDesarrolloModel } from '../models/plan-nacional-desarrollo.model';
import { RespuestaModel } from '../models/respuesta.model';

@Injectable({
    providedIn: 'root'
})
export class PlanNacionalDesarrolloService {
    apiUrl: string = `${environment.apiUrl}/planesnacionalesdesarrollo`;
    constructor(private http: HttpClient) {}

    getPlanesNacionalesDesarrollo(): Observable<PlanNacionalDesarrolloModel[]> {
        return this.http.get<PlanNacionalDesarrolloModel[]>(`${this.apiUrl}`);
    }

    getPlanNacionalDesarrollo(id: number): Observable<PlanNacionalDesarrolloModel> {
        return this.http.get<PlanNacionalDesarrolloModel>(`${this.apiUrl}/${id}`);
    }

    addPlanNacionalDesarrollo(plan: PlanNacionalDesarrolloModel): Observable<RespuestaModel> {
        return this.http.post<RespuestaModel>(`${this.apiUrl}`, plan);
    }

    updatePlanNacionalDesarrollo(id: number, plan: PlanNacionalDesarrolloModel): Observable<RespuestaModel> {
        return this.http.put<RespuestaModel>(`${this.apiUrl}/${id}`, plan);
    }

    patchPlanNacionalDesarrolloEstado(id: number, motivo: any): Observable<RespuestaModel> {
        return this.http.patch<RespuestaModel>(`${this.apiUrl}/${id}`, motivo);
    }

    deletePlanNacionalDesarrollo(id: number, motivo: any): Observable<RespuestaModel> {
        return this.http.delete<RespuestaModel>(`${this.apiUrl}/${id}`, { body: motivo });
    }

}
