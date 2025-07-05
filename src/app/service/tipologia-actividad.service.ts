import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TipologiaActividadModel } from '../models/tipologia-actividad.model';
import { RespuestaModel } from '../models/respuesta.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TipologiaActividadService {
    apiUrl: string = `${environment.apiUrl}/tipologiasactividades`;
    constructor(private http: HttpClient) {}
    getTipologiasActividades(): Observable<TipologiaActividadModel[]> {
        return this.http.get<TipologiaActividadModel[]>(this.apiUrl);
    }

    getTipologiaActividadById(id: number): Observable<TipologiaActividadModel> {
        return this.http.get<TipologiaActividadModel>(`${this.apiUrl}/${id}`);
    }
    addTipologiaActividad(tipologiaActividad: TipologiaActividadModel): Observable<RespuestaModel> {
        return this.http.post<RespuestaModel>(this.apiUrl, tipologiaActividad);
    }
    updateTipologiaActividad(id: number, tipologiaActividad: TipologiaActividadModel): Observable<RespuestaModel> {
        return this.http.put<RespuestaModel>(`${this.apiUrl}/${id}`, tipologiaActividad);
    }
    deleteTipologiaActividad(id: number): Observable<RespuestaModel> {
        return this.http.delete<RespuestaModel>(`${this.apiUrl}/${id}`);
    }
}
