import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InstitucionModel } from '../models/institucion.model';
import { RespuestaModel } from '../models/respuesta.model';

@Injectable({
    providedIn: 'root'
})
export class InstitucionService {
    apiUrl: string = `${environment.apiUrl}/entidadesestado`;
    constructor(private http: HttpClient) {}
    getInstituciones():Observable<InstitucionModel[]> {
        return this.http.get<InstitucionModel[]>(this.apiUrl);
    }

    getInstitucionById(id: number): Observable<InstitucionModel> {
        return this.http.get<InstitucionModel>(`${this.apiUrl}/${id}`);
    }

    addInstitucion(institucion: InstitucionModel): Observable<RespuestaModel> {

        return this.http.post<RespuestaModel>(this.apiUrl, institucion);
    }

    updateInstitucion(id: number, institucion: InstitucionModel): Observable<RespuestaModel> {

        return this.http.put<RespuestaModel>(`${this.apiUrl}/${id}`, institucion);
    }

    patchEstadoInstitucion(id: number, motivo: any): Observable<RespuestaModel> {
        return this.http.patch<RespuestaModel>(`${this.apiUrl}/${id}/inactivate`, motivo);
    }

    deleteInstitucion(id: number, motivo: any): Observable<RespuestaModel> {
        return this.http.delete<RespuestaModel>(`${this.apiUrl}/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            body: motivo
        });
    }
}
