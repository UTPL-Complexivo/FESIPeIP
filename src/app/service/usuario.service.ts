import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuarioModel } from '../models/usuario.model';
import { RespuestaModel } from '../models/respuesta.model';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    apiUrl: string = `${environment.apiUrl}/usuarios`;
    private currentUserSubject = new BehaviorSubject<UsuarioModel | null>(this.getUserFromStorage());
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) { }

    getUsuarios(): Observable<UsuarioModel[]> {
        return this.http.get<UsuarioModel[]>(this.apiUrl);
    }

    getUsuario(id: string): Observable<UsuarioModel> {
        return this.http.get<UsuarioModel>(`${this.apiUrl}/${id}`);
    }

    getMe(): Observable<UsuarioModel> {
        return this.http.get<UsuarioModel>(`${this.apiUrl}/me`).pipe(
            tap(user => {
                this.saveUserToStorage(user);
                this.currentUserSubject.next(user);
            })
        );
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

    patchResetPassword(id: string): Observable<RespuestaModel> {
        return this.http.patch<RespuestaModel>(`${this.apiUrl}/${id}/reset-password`, {});
    }

    deleteUsuario(id: string): Observable<RespuestaModel> {
        return this.http.delete<RespuestaModel>(`${this.apiUrl}/${id}`);
    }

    private saveUserToStorage(user: UsuarioModel): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    private getUserFromStorage(): UsuarioModel | null {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    getCurrentUser(): UsuarioModel | null {
        return this.currentUserSubject.value;
    }

    getIdEntidadEstado(): number | null {
        const user = this.getCurrentUser();
        return user ? user.idEntidadEstado : null;
    }

    clearUser(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
