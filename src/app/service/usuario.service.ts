import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    apiUrl: string = `${environment.apiUrl}/usuarios`
    constructor(private http: HttpClient) { }

    getUsuarios(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getMe(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/me`);
    }
}
