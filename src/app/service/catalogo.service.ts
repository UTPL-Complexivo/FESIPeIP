import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogoModel } from '../models/catalogo.model';

@Injectable({
    providedIn: 'root'
})
export class CatalogoService {
    apiUrl: string = `${environment.apiUrl}/catalogos`;
    constructor(private http: HttpClient) {}
    getCatalogosByTipo(tipo: number): Observable<CatalogoModel[]> {
        return this.http.get<CatalogoModel[]>(`${this.apiUrl}/tipo/${tipo}`);
    }
}
