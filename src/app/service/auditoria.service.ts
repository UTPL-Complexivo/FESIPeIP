import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuditEventModel } from '../models/audit-event.model';

export interface AuditoriaFiltros {
    modulo: string;
    entidad?: string;
    accion?: string;
    desde?: Date;
    hasta?: Date;
    limit?: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuditoriaService {
    private apiUrl = `${environment.apiUrl}/auditoria`;

    constructor(private http: HttpClient) {}

    getLogs(filtros: AuditoriaFiltros): Observable<AuditEventModel[]> {
        let params = new HttpParams();
        if (filtros.limit) params = params.set('limit', filtros.limit.toString());
        if (filtros.desde) params = params.set('desde', filtros.desde.toISOString());
        if (filtros.hasta) params = params.set('hasta', filtros.hasta.toISOString());

        const { modulo, entidad, accion } = filtros;

        let url: string;
        if (entidad && accion) {
            url = `${this.apiUrl}/modulo/${encodeURIComponent(modulo)}/entidad/${encodeURIComponent(entidad)}/accion/${encodeURIComponent(accion)}`;
        } else if (entidad) {
            url = `${this.apiUrl}/modulo/${encodeURIComponent(modulo)}/entidad/${encodeURIComponent(entidad)}`;
        } else if (accion) {
            url = `${this.apiUrl}/modulo/${encodeURIComponent(modulo)}/accion/${encodeURIComponent(accion)}`;
        } else {
            url = `${this.apiUrl}/modulo/${encodeURIComponent(modulo)}`;
        }

        return this.http.get<AuditEventModel[]>(url, { params });
    }
}
