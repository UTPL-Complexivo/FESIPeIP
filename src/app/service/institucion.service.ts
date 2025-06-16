import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InstitucionModel } from '../models/institucion.model';

@Injectable({
    providedIn: 'root'
})
export class InstitucionService {
    apiUrl: string = `${environment.apiUrl}/instituciones`;
    constructor(private http: HttpClient) {}
    getInstituciones():Observable<InstitucionModel[]> {
        return this.http.get<InstitucionModel[]>(this.apiUrl);
    }
}
