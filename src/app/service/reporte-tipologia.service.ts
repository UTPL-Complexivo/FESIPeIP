import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FiltroTipologiaModel } from '../models/filtro-tipologia.model';
import { ReporteTipologiaModel } from '../models/reporte-tipologia.model';
import { Observable } from 'rxjs';

// Interfaces para las opciones de los selectores
export interface OpcionSelect {
  label: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReporteTipologiaService {
  apiUrl: string = `${environment.apiUrl}/ReportesTipologiaActividad`;

  constructor(private http: HttpClient) { }

  getData(filtro: FiltroTipologiaModel): Observable<ReporteTipologiaModel[]> {
    return this.http.post<ReporteTipologiaModel[]>(`${this.apiUrl}/json`, filtro, {
      responseType: 'json',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  exportToPDF(filtro: FiltroTipologiaModel): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/pdf`, filtro, {
      responseType: 'blob',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  exportToExcel(filtro: FiltroTipologiaModel): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/excel`, filtro, {
      responseType: 'blob',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  exportToJSON(filtro: FiltroTipologiaModel): Observable<ReporteTipologiaModel[]> {
    return this.http.post<ReporteTipologiaModel[]>(`${this.apiUrl}/json`, filtro, {
      responseType: 'json',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
