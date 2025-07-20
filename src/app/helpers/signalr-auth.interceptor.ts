import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SignalRAuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si es una petición a SignalR, agregar headers de autenticación
    if (req.url.includes('/signalr')) {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            'Authorization': `Bearer ${token}`
          }
        });
        return next.handle(authReq);
      }
    }
    
    return next.handle(req);
  }
}
