import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SolicitudAprobacionModel } from '../models/solicitud-aprobacion.model';
import { RespuestaModel } from '../models/respuesta.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AprobacionesService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/aprobaciones`;
    constructor() {}
    aprobarSolicitud(solicitud: SolicitudAprobacionModel): Observable<RespuestaModel> {
        return this.http.post<RespuestaModel>(`${this.apiUrl}`, solicitud);
    }
}
