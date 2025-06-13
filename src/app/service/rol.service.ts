import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolModel } from '../models/rol.model';

@Injectable({
    providedIn: 'root'
})
export class RolService {
    apiUrl: string = `${environment.apiUrl}/roles`;
    constructor(private http: HttpClient) {}
    getRoles(): Observable<RolModel[]> {
        return this.http.get<RolModel[]>(`${this.apiUrl}`);
    }
}
