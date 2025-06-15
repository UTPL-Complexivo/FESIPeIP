import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SectorModel } from '../models/sector.model';
import { RespuestaModel } from '../models/respuesta.model';

@Injectable({
    providedIn: 'root'
})
export class SectorService {
    apiUrl: string = `${environment.apiUrl}/sectores`;
    constructor(private http: HttpClient) {}
    getSectores(): Observable<SectorModel[]> {
        return this.http.get<SectorModel[]>(this.apiUrl);
    }

    getSectoresByMacroSectorId(id: number): Observable<SectorModel[]> {
        return this.http.get<SectorModel[]>(`${this.apiUrl}/${id}/macrosector`);
    }

    getSectorById(id: number): Observable<SectorModel> {
        return this.http.get<SectorModel>(`${this.apiUrl}/${id}`);
    }

    addSector(sector: SectorModel): Observable<RespuestaModel> {
        return this.http.post<RespuestaModel>(this.apiUrl, sector);
    }

    updateSector(id: number, sector: SectorModel): Observable<RespuestaModel> {
        return this.http.put<RespuestaModel>(`${this.apiUrl}/${id}`, sector);
    }

    patchEstado(id: number, motivo: any): Observable<RespuestaModel> {
        return this.http.patch<RespuestaModel>(`${this.apiUrl}/${id}/inactivate`, motivo, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    deleteSector(id: number, motivo: any): Observable<RespuestaModel> {
        return this.http.delete<RespuestaModel>(`${this.apiUrl}/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            body: motivo
        });
    }
}
