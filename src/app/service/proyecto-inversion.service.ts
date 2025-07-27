import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ProyectoInversionModel } from '../models/proyecto-inversion.model';
import { RespuestaModel } from '../models/respuesta.model';
import { ProyectoInversionEstadoLogModel } from '../models/proyecto-inversion-estado-log.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ProyectoInversionService {
    apiUrl: string = `${environment.apiUrl}/proyectoinversion`;
    constructor(private http: HttpClient) {}
    getAll(): Observable<ProyectoInversionModel[]> {
        return this.http.get<ProyectoInversionModel[]>(this.apiUrl);
    }

    getProyectosByUserId(userId: string): Observable<ProyectoInversionModel[]> {
        return this.http.get<ProyectoInversionModel[]>(`${this.apiUrl}/usuario/${userId}`);
    }

    getById(id: number): Observable<ProyectoInversionModel> {
        return this.http.get<ProyectoInversionModel>(`${this.apiUrl}/${id}`);
    }

    add(proyecto: ProyectoInversionModel): Observable<RespuestaModel> {
        return this.http.post<RespuestaModel>(this.apiUrl, proyecto);
    }

    update(id: number, proyecto: ProyectoInversionModel): Observable<RespuestaModel> {
        return this.http.put<RespuestaModel>(`${this.apiUrl}/${id}`, proyecto);
    }
    delete(id: number): Observable<RespuestaModel> {
        return this.http.delete<RespuestaModel>(`${this.apiUrl}/${id}`);
    }

    uploadAnexo(id: number, file: File, nombre: string, descripcion: string): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);

        return this.http.post<any>(`${this.apiUrl}/${id}/anexos`, formData);
    }

    descargarAnexo(anexoId: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/anexos/${anexoId}/descargar`, {
            responseType: 'blob'
        });
    }

    eliminarAnexo(anexoId: number): Observable<RespuestaModel> {
        return this.http.delete<RespuestaModel>(`${this.apiUrl}/anexos/${anexoId}`);
    }

    getEstados(proyectoId: number): Observable<ProyectoInversionEstadoLogModel[]> {
        return this.http.get<ProyectoInversionEstadoLogModel[]>(`${this.apiUrl}/${proyectoId}/estados`);
    }

    aprobarProyecto(id: number, estado: string, comentario?: string): Observable<RespuestaModel> {
        const params = { estado: estado };
        const body = comentario || '';
        console.log("params",params);
        console.log("body",body);
        return this.http.post<RespuestaModel>(`${this.apiUrl}/${id}/aprobar`, `"${body}"`, {
            params: params,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
