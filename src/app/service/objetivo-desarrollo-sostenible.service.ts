import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjetivoDesarrolloSostenibleModel } from '../models/objetivo-desarrollo-sostenible.model';
import { RespuestaModel } from '../models/respuesta.model';

@Injectable({
    providedIn: 'root'
})
export class ObjetivoDesarrolloSostenibleService {
    apiUrl: string = `${environment.apiUrl}/objetivosdesarrollosostenibles`;
    constructor(private http: HttpClient) {}
    getObjetivosDesarrolloSostenible(): Observable<ObjetivoDesarrolloSostenibleModel[]> {
        return this.http.get<ObjetivoDesarrolloSostenibleModel[]>(`${this.apiUrl}`);
    }

    getObjetivoDesarrolloSostenible(id: number): Observable<ObjetivoDesarrolloSostenibleModel> {
        return this.http.get<ObjetivoDesarrolloSostenibleModel>(`${this.apiUrl}/${id}`);
    }

    addObjetivoDesarrolloSostenible(objetivo: ObjetivoDesarrolloSostenibleModel): Observable<RespuestaModel> {
        return this.http.post<RespuestaModel>(`${this.apiUrl}`, objetivo);
    }

    updateObjetivoDesarrolloSostenible(id: number, objetivo: ObjetivoDesarrolloSostenibleModel): Observable<RespuestaModel> {
        return this.http.put<RespuestaModel>(`${this.apiUrl}/${id}`, objetivo);
    }

    patchObjetivoDesarrolloSostenibleEstado(id: number, motivo: { estado: string; motivo: string }): Observable<RespuestaModel> {
        return this.http.patch<RespuestaModel>(`${this.apiUrl}/${id}`, motivo);
    }

    deleteObjetivoDesarrolloSostenible(id: number, motivo: { estado: string; motivo: string }): Observable<RespuestaModel> {
        return this.http.delete<RespuestaModel>(`${this.apiUrl}/${id}`, { body: motivo });
    }
}
