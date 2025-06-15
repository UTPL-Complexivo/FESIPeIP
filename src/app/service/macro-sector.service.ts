import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MacroSectorModel } from '../models/macro-sector.model';
import { Observable } from 'rxjs';
import { RespuestaModel } from '../models/respuesta.model';

@Injectable({
    providedIn: 'root'
})
export class MacroSectorService {
    apiUrl: string = `${environment.apiUrl}/macrosectores`;
    constructor(private http: HttpClient) {}
    getMacroSectores(): Observable<MacroSectorModel[]> {
        return this.http.get<MacroSectorModel[]>(this.apiUrl);
    }

    addMacroSector(macroSector: MacroSectorModel): Observable<RespuestaModel> {
        return this.http.post<RespuestaModel>(this.apiUrl, macroSector);
    }

    getMacroSectorById(id: number): Observable<MacroSectorModel> {
        return this.http.get<MacroSectorModel>(`${this.apiUrl}/${id}`);
    }

    updateMacroSector(id: number, macroSector: MacroSectorModel): Observable<RespuestaModel> {
        return this.http.put<RespuestaModel>(`${this.apiUrl}/${id}`, macroSector);
    }

    deleteMacroSector(id: number, motivo: any): Observable<RespuestaModel> {
        return this.http.delete<RespuestaModel>(`${this.apiUrl}/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            body: motivo
         });
    }

    patchMacroSectorEstado(id: number, motivo: any): Observable<RespuestaModel> {
        return this.http.patch<RespuestaModel>(`${this.apiUrl}/${id}/inactivate`, motivo, {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
