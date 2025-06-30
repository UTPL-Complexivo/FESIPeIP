import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipologiaModel } from '../models/tipologia.model';
import { RespuestaModel } from '../models/respuesta.model';

@Injectable({
    providedIn: 'root'
})
export class TipologiaService {
    apiUrl: string = `${environment.apiUrl}/tipologias`;
    constructor(private http: HttpClient) {}
    
    getTipologias(): Observable<TipologiaModel[]> {
        return this.http.get<TipologiaModel[]>(this.apiUrl);
    }

    getTipologiaById(id: number): Observable<TipologiaModel> {
        return this.http.get<TipologiaModel>(`${this.apiUrl}/${id}`);
    }

    addTipologia(tipologia: TipologiaModel): Observable<RespuestaModel> {
        return this.http.post<RespuestaModel>(this.apiUrl, tipologia);
    }

    updateTipologia(id: number, tipologia: TipologiaModel): Observable<RespuestaModel> {
        return this.http.put<RespuestaModel>(`${this.apiUrl}/${id}`, tipologia);
    }

    patchTipologiaEstado(id: number, motivo: any): Observable<RespuestaModel> {
        return this.http.patch<RespuestaModel>(`${this.apiUrl}/${id}/inactivar`, motivo, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    deleteTipologia(id: number, motivo: any): Observable<RespuestaModel> {
        return this.http.delete<RespuestaModel>(`${this.apiUrl}/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            body: motivo
        });
    }
}
