import { Injectable, inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection?: HubConnection;
  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  private currentUserRoles: string[] = [];
  private authService = inject(AuthService);

  // Observable para el estado de conexión
  public isConnected$ = this.isConnectedSubject.asObservable();

  constructor() {
    this.createConnection();
  }  /**
   * Crea la conexión SignalR
   */
  private createConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.signalRUrl || `${environment.apiUrl}/hubs/notificaciones`, {
        withCredentials: true,
        accessTokenFactory: () => {
          // Obtener el token de Auth0
          return new Promise<string>((resolve, reject) => {
            this.authService.getAccessTokenSilently().subscribe({
              next: (token: string) => {
                resolve(token);
              },
              error: (error) => {
                console.error('❌ [SignalRService] Error obteniendo token:', error);
                resolve(''); // Resolver con token vacío si falla
              }
            });
          });
        }
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();    // Manejar eventos de conexión
    this.hubConnection.onclose(() => {
      this.isConnectedSubject.next(false);
    });

    this.hubConnection.onreconnected(() => {
      this.isConnectedSubject.next(true);

      // Reconfigurar grupos automáticamente después de la reconexión
      if (this.currentUserRoles.length > 0) {
        this.setupUserGroups(this.currentUserRoles)
          .then(() => {
            // Grupos reconfigurados exitosamente
          })
          .catch(error => {
            console.error('❌ [SignalRService] Error reconfigurando grupos:', error);
          });
      }
    });

    this.hubConnection.onreconnecting(() => {
      this.isConnectedSubject.next(false);
    });
  }

  /**
   * Inicia la conexión SignalR
   */
  public startConnection(): Promise<void> {
    if (!this.hubConnection) {
      this.createConnection();
    }

    // Si ya está conectado, no hacer nada
    if (this.hubConnection!.state === 'Connected') {
      return Promise.resolve();
    }

    // Si está conectando, esperar
    if (this.hubConnection!.state === 'Connecting') {
      return new Promise((resolve, reject) => {
        const checkConnection = () => {
          if (this.hubConnection!.state === 'Connected') {
            resolve();
          } else if (this.hubConnection!.state === 'Disconnected') {
            console.error('❌ [SignalRService] Conexión falló (esperando)');
            reject(new Error('Connection failed'));
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });
    }

    return this.hubConnection!.start()
      .then(() => {
        this.isConnectedSubject.next(true);
      })
      .catch(error => {
        this.isConnectedSubject.next(false);
        console.error('❌ [SignalRService] Error iniciando conexión SignalR:', error);
        console.error('🔍 [SignalRService] Detalles del error:', error.message);

        // Verificar si es un error de autenticación
        if (error.message && error.message.includes('401')) {
          console.error('🔐 [SignalRService] ERROR DE AUTENTICACIÓN: Token inválido o expirado');
        }

        throw error;
      });
  }

  /**
   * Unirse a un grupo específico
   */
  public joinGroup(groupName: string): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === 'Connected') {
      return this.hubConnection.invoke('JoinGroup', groupName.toLowerCase());
    }
    return Promise.reject('SignalR connection is not established');
  }

  /**
   * Salir de un grupo específico
   */
  public leaveGroup(groupName: string): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === 'Connected') {
      return this.hubConnection.invoke('LeaveGroup', groupName);
    }
    return Promise.reject('SignalR connection is not established');
  }

  /**
   * Detiene la conexión SignalR
   */
  public stopConnection(): Promise<void> {
    if (this.hubConnection) {
      return this.hubConnection.stop()
        .then(() => {
          this.isConnectedSubject.next(false);
        });
    }
    return Promise.resolve();
  }

  /**
   * Escucha un evento específico del hub
   */
  public on<T>(methodName: string): Observable<T> {
    return new Observable<T>(observer => {
      if (this.hubConnection) {
        const handler = (data: T) => {
          observer.next(data);
        };

        this.hubConnection.on(methodName, handler);

        // Cleanup cuando se desuscribe
        return () => {
          if (this.hubConnection) {
            this.hubConnection.off(methodName, handler);
          }
        };
      }
      return () => {};
    });
  }

  public invoke<T>(methodName: string, ...args: any[]): Promise<T> {
    if (this.hubConnection && this.hubConnection.state === 'Connected') {
      return this.hubConnection.invoke<T>(methodName, ...args);
    }
    return Promise.reject('SignalR connection is not established');
  }

  /**
   * Envía un mensaje sin esperar respuesta
   */
  public send(methodName: string, ...args: any[]): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === 'Connected') {
      return this.hubConnection.send(methodName, ...args);
    }
    return Promise.reject('SignalR connection is not established');
  }

  /**
   * Verifica si la conexión está activa
   */
  public get isConnected(): boolean {
    return this.hubConnection?.state === 'Connected';
  }

  /**
   * Obtiene el estado actual de la conexión
   */
  public get connectionState(): string {
    return this.hubConnection?.state || 'Disconnected';
  }

  /**
   * Configura grupos automáticamente basado en los roles del usuario
   */
  public setupUserGroups(userRoles: string[]): Promise<void[]> {
    if (!this.hubConnection) {
      console.error('❌ [SignalRService] No hay conexión de hub');
      return Promise.reject('SignalR hub connection is not established');
    }

    if (this.hubConnection.state !== 'Connected') {
      console.warn('⚠️ [SignalRService] SignalR no está conectado. Estado:', this.hubConnection.state);
      return Promise.reject('SignalR connection is not established');
    }

    // Guardar roles actuales para reconexión automática
    this.currentUserRoles = [...userRoles];

    const groupPromises = userRoles.map(role => {
      const groupName = role.toLowerCase();

      return this.joinGroup(groupName)
        .then(() => {
          // Usuario añadido al grupo exitosamente
        })
        .catch(error => {
          console.error(`❌ [SignalRService] Error al unirse al grupo ${groupName}:`, error);
          throw error;
        });
    });

    return Promise.all(groupPromises);
  }

  /**
   * Método para probar la conexión SignalR
   */
  public testConnection(): void {
    // Verificar estado de autenticación
    this.authService.isAuthenticated$.subscribe(isAuth => {
      // Usuario autenticado
    });

    this.authService.getAccessTokenSilently().subscribe({
      next: (token) => {
        // Token disponible
      },
      error: (error) => {
        console.error('❌ Error obteniendo token:', error);
      }
    });
  }  /**
   * Remueve al usuario de grupos específicos
   */
  public leaveUserGroups(userRoles: string[]): Promise<void[]> {
    if (!this.hubConnection || this.hubConnection.state !== 'Connected') {
      console.warn('SignalR no está conectado. No se pueden abandonar grupos.');
      return Promise.reject('SignalR connection is not established');
    }

    const leavePromises = userRoles.map(role => {
      const groupName = role.toLowerCase();

      return this.leaveGroup(groupName)
        .then(() => {
          // Usuario removido del grupo exitosamente
        })
        .catch(error => {
          console.error(`❌ Error al abandonar el grupo ${groupName}:`, error);
          throw error;
        });
    });

    return Promise.all(leavePromises);
  }
}
