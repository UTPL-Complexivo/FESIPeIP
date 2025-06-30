import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlineacionModel } from '../models/alineacion.model';
import { RespuestaModel } from '../models/respuesta.model';

@Injectable({
    providedIn: 'root'
})
export class AlineacionService {
    apiUrl: string = `${environment.apiUrl}/alineaciones`;
    constructor(private http: HttpClient) {}
    getAlineaciones():Observable<AlineacionModel[]> {
        return this.http.get<AlineacionModel[]>(this.apiUrl);
    }

    getAlineacionById(id: number): Observable<AlineacionModel> {
        return this.http.get<AlineacionModel>(`${this.apiUrl}/${id}`);
    }

    addAlineacion(alineacion: AlineacionModel): Observable<RespuestaModel> {
        return this.http.post<RespuestaModel>(this.apiUrl, alineacion);
    }

    addMultiplesAlineaciones(alineaciones: AlineacionModel[]): Observable<RespuestaModel> {
        return this.http.post<RespuestaModel>(`${this.apiUrl}/multiples`, alineaciones);
    }

    updateAlineacion(id: number, alineacion: AlineacionModel): Observable<RespuestaModel> {
        return this.http.put<RespuestaModel>(`${this.apiUrl}/${id}`, alineacion);
    }

    deleteAlineacion(id: number, motivo: any): Observable<RespuestaModel> {
        return this.http.delete<RespuestaModel>(`${this.apiUrl}/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            body: motivo
        });
    }
}
