import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ProyectoInversionModel } from '../models/proyecto-inversion.model';
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

    getById(id: number): Observable<ProyectoInversionModel> {
        return this.http.get<ProyectoInversionModel>(`${this.apiUrl}/${id}`);
    }

    add(proyecto: ProyectoInversionModel): Observable<ProyectoInversionModel> {
        return this.http.post<ProyectoInversionModel>(this.apiUrl, proyecto);
    }

    update(id: number, proyecto: ProyectoInversionModel): Observable<ProyectoInversionModel> {
        return this.http.put<ProyectoInversionModel>(`${this.apiUrl}/${id}`, proyecto);
    }
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    uploadAnexo(id: number, file: File, nombre: string, descripcion: string): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);

        return this.http.post<any>(`${this.apiUrl}/${id}/anexos`, formData);
    }
}
