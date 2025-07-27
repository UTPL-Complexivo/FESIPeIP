import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FiltroObjetivoEstrategicoModel } from '../models/filtro-objetivo-estrategico.model';
import { ReporteObjetivoEstrategicoModel } from '../models/reporte-objetivo-estrategico.model';
import { Observable } from 'rxjs';

// Interfaces para las opciones de los selectores
export interface OpcionSelect {
  label: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReporteObjetivoEstrategicoService {
  apiUrl: string = `${environment.apiUrl}/ReportesObjetivosEstrategicos`;

  constructor(private http: HttpClient) { }

  getData(filtro: FiltroObjetivoEstrategicoModel): Observable<ReporteObjetivoEstrategicoModel[]> {
    return this.http.post<ReporteObjetivoEstrategicoModel[]>(`${this.apiUrl}/json`, filtro, {
      responseType: 'json',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  exportToPDF(filtro: FiltroObjetivoEstrategicoModel): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/pdf`, filtro, {
      responseType: 'blob',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  exportToExcel(filtro: FiltroObjetivoEstrategicoModel): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/excel`, filtro, {
      responseType: 'blob',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  exportToJSON(filtro: FiltroObjetivoEstrategicoModel): Observable<ReporteObjetivoEstrategicoModel[]> {
    return this.http.post<ReporteObjetivoEstrategicoModel[]>(`${this.apiUrl}/json`, filtro, {
      responseType: 'json',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
