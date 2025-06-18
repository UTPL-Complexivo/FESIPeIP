import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CatalogoService {
    apiUrl: string = `${environment.apiUrl}/catalogos`;
    constructor(private http: HttpClient) {}
    getCatalogosByTipo(tipo: number) {
        return this.http.get(`${this.apiUrl}/tipo/${tipo}`);
    }
}
