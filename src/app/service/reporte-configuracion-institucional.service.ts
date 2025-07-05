import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FiltroMacroSectorModel } from '../models/filtro-macro-sector.model';
import { ReporteMacroSectorModel } from '../models/reporte-macrosector.model';
import { Observable } from 'rxjs';

// Interfaces para las opciones de los selectores
export interface OpcionSelect {
  label: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReporteConfiguracionInstitucionalService {
  apiUrl: string = `${environment.apiUrl}/ReportesConfiguracion`;

  constructor(private http: HttpClient) { }

  // Métodos para obtener listas de opciones en cascada
  getMacroSectores(): Observable<OpcionSelect[]> {
    return this.http.get<OpcionSelect[]>(`${this.apiUrl}/macrosectores`);
  }

  getSectores(macroSectorNombre?: string): Observable<OpcionSelect[]> {
    const url = macroSectorNombre
      ? `${this.apiUrl}/sectores?macroSectorNombre=${encodeURIComponent(macroSectorNombre)}`
      : `${this.apiUrl}/sectores`;
    return this.http.get<OpcionSelect[]>(url);
  }

  getSubsectores(sectorNombre?: string): Observable<OpcionSelect[]> {
    const url = sectorNombre
      ? `${this.apiUrl}/subsectores?sectorNombre=${encodeURIComponent(sectorNombre)}`
      : `${this.apiUrl}/subsectores`;
    return this.http.get<OpcionSelect[]>(url);
  }

  getInstituciones(subsectorNombre?: string): Observable<OpcionSelect[]> {
    const url = subsectorNombre
      ? `${this.apiUrl}/instituciones?subsectorNombre=${encodeURIComponent(subsectorNombre)}`
      : `${this.apiUrl}/instituciones`;
    return this.http.get<OpcionSelect[]>(url);
  }

  getData(filtro: FiltroMacroSectorModel): Observable<ReporteMacroSectorModel[]> {
    return this.http.post<ReporteMacroSectorModel[]>(`${this.apiUrl}/json`, filtro, {
      responseType: 'json',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  exportToPDF(filtro: FiltroMacroSectorModel): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/pdf`, filtro, {
      responseType: 'blob',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  exportToExcel(filtro: FiltroMacroSectorModel): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/excel`, filtro, {
      responseType: 'blob',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  exportToJSON(filtro: FiltroMacroSectorModel): Observable<ReporteMacroSectorModel[]> {
    return this.http.post<ReporteMacroSectorModel[]>(`${this.apiUrl}/json`, filtro, {
      responseType: 'json',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
