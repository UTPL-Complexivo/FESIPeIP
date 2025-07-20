import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NotificacionModel } from '../models/notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notificaciones`;

  constructor() { }

  /**
   * Obtiene todas las notificaciones del usuario actual
   */
  getNotificaciones(): Observable<NotificacionModel[]> {
    return this.http.get<NotificacionModel[]>(this.apiUrl);
  }

  /**
   * Obtiene las notificaciones no leídas del usuario actual
   */
  getNotificacionesNoLeidas(): Observable<NotificacionModel[]> {
    return this.http.get<NotificacionModel[]>(`${this.apiUrl}/no-leidas`);
  }

  /**
   * Marca una notificación como leída
   * @param id ID de la notificación
   */
  marcarLeida(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/marcar-leida/${id}`, {});
  }

  /**
   * Elimina una notificación específica
   * @param id ID de la notificación a eliminar
   */
  eliminarNotificacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Elimina múltiples notificaciones
   * @param ids Array de IDs de las notificaciones a eliminar
   */
  eliminarLista(ids: number[]): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar-lista`, {
      body: ids
    });
  }

  /**
   * Marca todas las notificaciones como leídas
   */
  marcarTodasLeidas(): Observable<any> {
    return this.http.post(`${this.apiUrl}/marcar-todas-leidas`, {});
  }
}
