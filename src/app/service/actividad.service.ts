import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ActividadModel } from '../models/actividad.model';
import { RespuestaModel } from '../models/respuesta.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ActividadService {
    apiUrl: string = `${environment.apiUrl}/actividades`;
    constructor(private http: HttpClient) {}
    getActividades(): Observable<ActividadModel[]> {
        return this.http.get<ActividadModel[]>(this.apiUrl);
    }

    getActividadById(id: number): Observable<ActividadModel> {
        return this.http.get<ActividadModel>(`${this.apiUrl}/${id}`);
    }
    addActividad(actividad: ActividadModel): Observable<RespuestaModel> {
        return this.http.post<RespuestaModel>(this.apiUrl, actividad);
    }
    updateActividad(id: number, actividad: ActividadModel): Observable<RespuestaModel> {
        return this.http.put<RespuestaModel>(`${this.apiUrl}/${id}`, actividad);
    }
    deleteActividad(id: number, motivo: any): Observable<RespuestaModel> {
        return this.http.delete<RespuestaModel>(`${this.apiUrl}/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            body: motivo
        });
    }
    patchActividadEstado(id: number, motivo: any): Observable<RespuestaModel> {
        return this.http.patch<RespuestaModel>(`${this.apiUrl}/${id}/inactivar`, motivo, {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
