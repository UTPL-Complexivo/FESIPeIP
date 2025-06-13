import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../models/usuario.model';
import { RespuestaModel } from '../models/respuesta.model';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    apiUrl: string = `${environment.apiUrl}/usuarios`
    constructor(private http: HttpClient) { }

    getUsuarios(): Observable<UsuarioModel[]> {
        return this.http.get<UsuarioModel[]>(this.apiUrl);
    }

    getUsuario(id: string): Observable<UsuarioModel> {
        return this.http.get<UsuarioModel>(`${this.apiUrl}/${id}`);
    }

    getMe(): Observable<UsuarioModel> {
        return this.http.get<UsuarioModel>(`${this.apiUrl}/me`);
    }

    addUsuario(usuario: UsuarioModel): Observable<RespuestaModel> {
        return this.http.post<RespuestaModel>(this.apiUrl, usuario);
    }

    putUsuario(id: string, usuario: UsuarioModel): Observable<RespuestaModel> {
        return this.http.put<RespuestaModel>(`${this.apiUrl}/${id}`, usuario);
    }

    patchEstado(id: string): Observable<RespuestaModel> {
        return this.http.patch<RespuestaModel>(`${this.apiUrl}/${id}/inactivate`, {});
    }
}
