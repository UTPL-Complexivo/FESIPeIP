import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolModel } from '../models/rol.model';
import { RespuestaModel } from '../models/respuesta.model';

@Injectable({
    providedIn: 'root'
})
export class RolService {
    apiUrl: string = `${environment.apiUrl}/roles`;
    constructor(private http: HttpClient) {}
    getRoles(): Observable<RolModel[]> {
        return this.http.get<RolModel[]>(`${this.apiUrl}`);
    }

    getRol(id: string): Observable<RolModel> {
        return this.http.get<RolModel>(`${this.apiUrl}/${id}`);
    }

    addRol(rol: RolModel): Observable<RespuestaModel> {
        return this.http.post<RespuestaModel>(`${this.apiUrl}`, rol);
    }

    updateRol(id: string, rol: RolModel): Observable<RespuestaModel> {
        return this.http.put<RespuestaModel>(`${this.apiUrl}/${id}`, rol);
    }

    patchEstado(id: string): Observable<RespuestaModel> {
        return this.http.patch<RespuestaModel>(`${this.apiUrl}/${id}/inactivate`, {});
    }

    deleteRol(id: string): Observable<RespuestaModel> {
        return this.http.delete<RespuestaModel>(`${this.apiUrl}/${id}`);
    }
}
