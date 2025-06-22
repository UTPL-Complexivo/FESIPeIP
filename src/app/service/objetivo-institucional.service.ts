import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjetivoInstitucionalModel } from '../models/objetivo-institucional.model';
import { RespuestaModel } from '../models/respuesta.model';
import { DeleteModel } from '../models/delete.model';

@Injectable({
    providedIn: 'root'
})
export class ObjetivoInstitucionalService {
    apiUrl: string = `${environment.apiUrl}/objetivosinstitucionales`;
    constructor(private http: HttpClient) {}
    getObjetivosInstitucionales(): Observable<ObjetivoInstitucionalModel[]> {
        return this.http.get<ObjetivoInstitucionalModel[]>(`${this.apiUrl}`);
    }

    getObjetivoInstitucional(id: number): Observable<ObjetivoInstitucionalModel> {
        return this.http.get<ObjetivoInstitucionalModel>(`${this.apiUrl}/${id}`);
    }

    addObjetivoInstitucional(objetivo: ObjetivoInstitucionalModel): Observable<RespuestaModel> {
        return this.http.post<RespuestaModel>(`${this.apiUrl}`, objetivo);
    }

    updateObjetivoInstitucional(id: number, objetivo: ObjetivoInstitucionalModel): Observable<RespuestaModel> {
        return this.http.put<RespuestaModel>(`${this.apiUrl}/${id}`, objetivo);
    }

    patchObjetivoInstitucionalEstado(id: number, motivo: DeleteModel): Observable<RespuestaModel> {
        return this.http.patch<RespuestaModel>(`${this.apiUrl}/${id}`, motivo);
    }

    deleteObjetivoInstitucional(id: number, motivo: DeleteModel): Observable<RespuestaModel> {
        return this.http.delete<RespuestaModel>(`${this.apiUrl}/${id}`, { body: motivo });
    }
}
