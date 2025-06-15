import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubSectorModel } from '../models/sub-sector.model';
import { RespuestaModel } from '../models/respuesta.model';

@Injectable({
    providedIn: 'root'
})
export class SubSectorService {
    apiUrl: string = `${environment.apiUrl}/subsectores`;
    constructor(private hhtp: HttpClient) {}
    getSubsectores(): Observable<SubSectorModel[]> {
        return this.hhtp.get<SubSectorModel[]>(this.apiUrl);
    }

    getSubsectoresById(id: number): Observable<SubSectorModel> {
        return this.hhtp.get<SubSectorModel>(`${this.apiUrl}/${id}`);
    }

    addSubSector(subSector: SubSectorModel): Observable<RespuestaModel> {
        return this.hhtp.post<RespuestaModel>(this.apiUrl, subSector);
    }

    updateSubSector(id: number, subSector: SubSectorModel): Observable<RespuestaModel> {
        return this.hhtp.put<RespuestaModel>(`${this.apiUrl}/${id}`, subSector);
    }

    patchSubSectorEstado(id: number, motivo: any): Observable<RespuestaModel> {
        return this.hhtp.patch<RespuestaModel>(`${this.apiUrl}/${id}/inactivate`, motivo, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    deleteSubSector(id: number, motivo: any): Observable<RespuestaModel> {
        return this.hhtp.delete<RespuestaModel>(`${this.apiUrl}/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            body: motivo
        });
    }
}
