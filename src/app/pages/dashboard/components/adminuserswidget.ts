import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioModel } from '../../../models/usuario.model';
import { RolModel } from '../../../models/rol.model';

@Component({
    selector: 'app-admin-users-widget',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule],
    template: `
        <div class="card !mb-8">
            <div class="flex items-center justify-between mb-4">
                <div class="font-semibold text-xl">Gestión de Usuarios</div>
                <div class="flex items-center gap-2">
                    <i class="pi pi-shield text-primary text-xl"></i>
                    <span class="text-sm text-muted-color">Panel de Administrador</span>
                </div>
            </div>
            
            @if (loading()) {
                <div class="flex justify-center items-center h-64">
                    <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
                </div>
            } @else {
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Usuarios Recientes -->
                    <div class="border border-surface-border rounded-lg p-4">
                        <h3 class="font-semibold text-lg mb-3 flex items-center gap-2">
                            <i class="pi pi-users text-primary"></i>
                            Usuarios Recientes
                        </h3>
                        <div class="space-y-3">
                            @for (usuario of usuariosRecientes(); track usuario.id) {
                                <div class="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded">
                                    <div class="flex items-center gap-3">
                                        <img 
                                            [src]="usuario.avatarUrl || '/assets/layout/images/avatar-default.png'" 
                                            [alt]="usuario.nombre"
                                            class="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <div class="font-medium">{{ usuario.nombre }}</div>
                                            <div class="text-sm text-muted-color">{{ usuario.correo }}</div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-sm font-medium">{{ usuario.tipoUsuario }}</div>
                                        <div class="text-xs" 
                                             [class]="usuario.estado === 'Activo' ? 'text-green-500' : 'text-red-500'">
                                            {{ usuario.estado }}
                                        </div>
                                    </div>
                                </div>
                            }
                            @empty {
                                <div class="text-center text-muted-color py-4">
                                    <i class="pi pi-users text-4xl mb-2"></i>
                                    <p>No hay usuarios disponibles</p>
                                </div>
                            }
                        </div>
                    </div>

                    <!-- Roles del Sistema -->
                    <div class="border border-surface-border rounded-lg p-4">
                        <h3 class="font-semibold text-lg mb-3 flex items-center gap-2">
                            <i class="pi pi-shield text-primary"></i>
                            Roles del Sistema
                        </h3>
                        <div class="space-y-3">
                            @for (rol of roles(); track rol.id) {
                                <div class="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded">
                                    <div>
                                        <div class="font-medium">{{ rol.nombre }}</div>
                                        <div class="text-sm text-muted-color">{{ rol.descripcion }}</div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-sm font-medium">{{ usuariosPorRol(rol.nombre) }} usuarios</div>
                                        <div class="text-xs" 
                                             [class]="rol.estado === 'Activo' ? 'text-green-500' : 'text-red-500'">
                                            {{ rol.estado }}
                                        </div>
                                    </div>
                                </div>
                            }
                            @empty {
                                <div class="text-center text-muted-color py-4">
                                    <i class="pi pi-shield text-4xl mb-2"></i>
                                    <p>No hay roles disponibles</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <!-- Estadísticas Rápidas -->
                <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <i class="pi pi-users text-primary text-2xl mb-2"></i>
                        <div class="font-bold text-lg">{{ estadisticas().totalUsuarios }}</div>
                        <div class="text-sm text-muted-color">Total Usuarios</div>
                    </div>
                    <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <i class="pi pi-user-plus text-green-500 text-2xl mb-2"></i>
                        <div class="font-bold text-lg">{{ estadisticas().usuariosActivos }}</div>
                        <div class="text-sm text-muted-color">Activos</div>
                    </div>
                    <div class="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <i class="pi pi-shield text-orange-500 text-2xl mb-2"></i>
                        <div class="font-bold text-lg">{{ estadisticas().totalRoles }}</div>
                        <div class="text-sm text-muted-color">Total Roles</div>
                    </div>
                    <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <i class="pi pi-verified text-purple-500 text-2xl mb-2"></i>
                        <div class="font-bold text-lg">{{ estadisticas().rolesActivos }}</div>
                        <div class="text-sm text-muted-color">Roles Activos</div>
                    </div>
                </div>
            }
        </div>
    `
})
export class AdminUsersWidget {
    // Inputs para recibir datos
    usuarios = input<UsuarioModel[]>([]);
    roles = input<RolModel[]>([]);
    loading = input<boolean>(false);

    // Computed para obtener usuarios recientes (últimos 5)
    usuariosRecientes = computed(() => {
        const usuariosData = this.usuarios();
        return usuariosData
            .filter(usuario => !usuario.eliminado)
            .sort((a, b) => a.id.localeCompare(b.id))
            .slice(0, 5);
    });

    // Computed para estadísticas
    estadisticas = computed(() => {
        const usuariosData = this.usuarios();
        const rolesData = this.roles();
        
        return {
            totalUsuarios: usuariosData.filter(u => !u.eliminado).length,
            usuariosActivos: usuariosData.filter(u => u.estado === 'Activo' && !u.eliminado).length,
            totalRoles: rolesData.length,
            rolesActivos: rolesData.filter(r => r.estado === 'Activo').length
        };
    });

    // Método para contar usuarios por rol
    usuariosPorRol(nombreRol: string): number {
        return this.usuarios().filter(usuario => 
            usuario.roles.includes(nombreRol) && !usuario.eliminado
        ).length;
    }
}
