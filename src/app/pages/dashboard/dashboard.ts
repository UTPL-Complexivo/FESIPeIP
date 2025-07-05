import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget, StatCard } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { AdminUsersWidget } from './components/adminuserswidget';
import { MacroSectorService } from '../../service/macro-sector.service';
import { SectorService } from '../../service/sector.service';
import { SubSectorService } from '../../service/sub-sector.service';
import { InstitucionService } from '../../service/institucion.service';
import { ObjetivoInstitucionalService } from '../../service/objetivo-institucional.service';
import { ObjetivoDesarrolloSostenibleService } from '../../service/objetivo-desarrollo-sostenible.service';
import { PlanNacionalDesarrolloService } from '../../service/plan-nacional-desarrollo.service';
import { TipologiaService } from '../../service/tipologia.service';
import { ActividadService } from '../../service/actividad.service';
import { TipologiaActividadService } from '../../service/tipologia-actividad.service';
import { UsuarioService } from '../../service/usuario.service';
import { RolService } from '../../service/rol.service';
import { InstitucionModel } from '../../models/institucion.model';
import { TipologiaModel } from '../../models/tipologia.model';
import { ActividadModel } from '../../models/actividad.model';
import { TipologiaActividadModel } from '../../models/tipologia-actividad.model';
import { UsuarioModel } from '../../models/usuario.model';
import { RolModel } from '../../models/rol.model';

@Component({
    selector: 'app-dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget, AdminUsersWidget],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <!-- Estadísticas de Usuarios y Roles (solo administradores) -->
            @if (esAdministrador()) {
                <app-stats-widget class="contents" [cards]="cardsUsuariosRoles()" />
                <!-- Widget detallado de usuarios para administradores -->
                <div class="col-span-12">
                    <app-admin-users-widget 
                        [usuarios]="usuarios()"
                        [roles]="roles()"
                        [loading]="loadingUsuariosRoles()"
                    />
                </div>
            } @else {
                <!-- Estadísticas de Configuración Institucional (no administradores) -->
                <app-stats-widget class="contents" [cards]="cardsConfiguracion()" />

                <!-- Estadísticas de Objetivos Estratégicos (solo planificadores) -->
                @if (esPlanificador()) {
                    <app-stats-widget class="contents" [cards]="cardsObjetivos()" />
                }

                <div class="col-span-12 xl:col-span-6">
                    <app-recent-sales-widget 
                        [instituciones]="ultimasInstituciones()" 
                        [loading]="loadingInstituciones()" 
                    />
                    <app-best-selling-widget />
                </div>
                <div class="col-span-12 xl:col-span-6">
                    <app-revenue-stream-widget 
                        [tipologias]="tipologias()"
                        [actividades]="actividades()"
                        [tipologiasActividades]="tipologiasActividades()"
                        [loading]="loadingProyectos()"
                    />
                    <app-notifications-widget />
                </div>
            }
        </div>
    `
})
export class Dashboard implements OnInit {
    // Servicios inyectados
    private macroSectorService = inject(MacroSectorService);
    private sectorService = inject(SectorService);
    private subSectorService = inject(SubSectorService);
    private institucionService = inject(InstitucionService);
    private objetivoInstitucionalService = inject(ObjetivoInstitucionalService);
    private objetivoDesarrolloSostenibleService = inject(ObjetivoDesarrolloSostenibleService);
    private planNacionalDesarrolloService = inject(PlanNacionalDesarrolloService);
    private tipologiaService = inject(TipologiaService);
    private actividadService = inject(ActividadService);
    private tipologiaActividadService = inject(TipologiaActividadService);
    private usuarioService = inject(UsuarioService);
    private rolService = inject(RolService);

    // Signals para el estado
    usuarioActual = signal<UsuarioModel | null>(null);
    cardsConfiguracion = signal<StatCard[]>([]);
    cardsObjetivos = signal<StatCard[]>([]);
    cardsUsuariosRoles = signal<StatCard[]>([]);
    ultimasInstituciones = signal<InstitucionModel[]>([]);
    loadingInstituciones = signal<boolean>(true);
    
    // Signals para datos de proyectos
    tipologias = signal<TipologiaModel[]>([]);
    actividades = signal<ActividadModel[]>([]);
    tipologiasActividades = signal<TipologiaActividadModel[]>([]);
    loadingProyectos = signal<boolean>(true);

    // Signals para datos de usuarios y roles (solo para administradores)
    usuarios = signal<UsuarioModel[]>([]);
    roles = signal<RolModel[]>([]);
    loadingUsuariosRoles = signal<boolean>(false);

    // Computed para verificar roles específicos
    esAdministrador = computed(() => {
        const usuario = this.usuarioActual();
        return usuario?.roles?.includes('Administrador') || false;
    });

    esPlanificador = computed(() => {
        const usuario = this.usuarioActual();
        return usuario?.roles?.includes('Planificador') || false;
    });

    ngOnInit(): void {
        this.obtenerUsuarioActual();
        // No inicializar skeletons ni cargar datos aquí
        // Todo se manejará después de obtener el usuario actual
    }

    /**
     * Carga todos los datos necesarios para el widget de proyectos
     */
    private cargarDatosProyectos(): void {
        // No cargar si es administrador
        if (this.esAdministrador()) {
            return;
        }

        this.loadingProyectos.set(true);

        forkJoin({
            tipologias: this.tipologiaService.getTipologias(),
            actividades: this.actividadService.getActividades(),
            tipologiasActividades: this.tipologiaActividadService.getTipologiasActividades()
        }).subscribe({
            next: (data) => {
                this.tipologias.set(data.tipologias);
                this.actividades.set(data.actividades);
                this.tipologiasActividades.set(data.tipologiasActividades);
                this.loadingProyectos.set(false);
            },
            error: (error) => {
                console.error('Error loading project data:', error);
                this.loadingProyectos.set(false);
            }
        });
    }

    /**
     * Inicializa las cards con estado de carga según el rol del usuario
     */
    inicializarSkeletons(): void {
        // Si es administrador, solo inicializar skeleton para usuarios/roles
        if (this.esAdministrador()) {
            return; // No inicializar otros skeletons para administradores
        }

        // Cards de configuración institucional (no administradores)
        this.cardsConfiguracion.set([
            {
                titulo: 'Macro Sectores',
                valor: 0,
                subtitulo: '',
                icono: 'pi-building',
                colorIcono: 'text-blue-500',
                colorFondo: 'bg-blue-100 dark:bg-blue-400/10',
                loading: true
            },
            {
                titulo: 'Sectores',
                valor: 0,
                subtitulo: '',
                icono: 'pi-sitemap',
                colorIcono: 'text-orange-500',
                colorFondo: 'bg-orange-100 dark:bg-orange-400/10',
                loading: true
            },
            {
                titulo: 'Subsectores',
                valor: 0,
                subtitulo: '',
                icono: 'pi-share-alt',
                colorIcono: 'text-cyan-500',
                colorFondo: 'bg-cyan-100 dark:bg-cyan-400/10',
                loading: true
            },
            {
                titulo: 'Instituciones',
                valor: 0,
                subtitulo: '',
                icono: 'pi-home',
                colorIcono: 'text-purple-500',
                colorFondo: 'bg-purple-100 dark:bg-purple-400/10',
                loading: true
            }
        ]);

        // Cards de objetivos (solo para planificadores)
        if (this.esPlanificador()) {
            this.cardsObjetivos.set([
                {
                    titulo: 'Objetivos Institucionales',
                    valor: 0,
                    subtitulo: '',
                    icono: 'pi-flag',
                    colorIcono: 'text-green-500',
                    colorFondo: 'bg-green-100 dark:bg-green-400/10',
                    loading: true
                },
                {
                    titulo: 'ODS',
                    valor: 0,
                    subtitulo: '',
                    icono: 'pi-globe',
                    colorIcono: 'text-teal-500',
                    colorFondo: 'bg-teal-100 dark:bg-teal-400/10',
                    loading: true
                },
                {
                    titulo: 'Planes Nacionales',
                    valor: 0,
                    subtitulo: '',
                    icono: 'pi-chart-line',
                    colorIcono: 'text-indigo-500',
                    colorFondo: 'bg-indigo-100 dark:bg-indigo-400/10',
                    loading: true
                },
                {
                    titulo: 'Alineación Total',
                    valor: 0,
                    subtitulo: '',
                    sufijo: '%',
                    icono: 'pi-compass',
                    colorIcono: 'text-pink-500',
                    colorFondo: 'bg-pink-100 dark:bg-pink-400/10',
                    loading: true
                }
            ]);
        }
    }

    cargarEstadisticasConfiguracion(): void {
        // No cargar si es administrador
        if (this.esAdministrador()) {
            return;
        }

        forkJoin({
            macroSectores: this.macroSectorService.getMacroSectores(),
            sectores: this.sectorService.getSectores(),
            subsectores: this.subSectorService.getSubsectores(),
            instituciones: this.institucionService.getInstituciones()
        }).subscribe({
            next: (data) => {
                this.cardsConfiguracion.set([
                    {
                        titulo: 'Macro Sectores',
                        valor: data.macroSectores.length,
                        subtitulo: `${data.macroSectores.filter(ms => ms.estado === 'Activo').length} activos configurados`,
                        icono: 'pi-building',
                        colorIcono: 'text-blue-500',
                        colorFondo: 'bg-blue-100 dark:bg-blue-400/10',
                        loading: false
                    },
                    {
                        titulo: 'Sectores',
                        valor: data.sectores.length,
                        subtitulo: `${data.sectores.filter(s => s.estado === 'Activo').length} activos en total`,
                        icono: 'pi-sitemap',
                        colorIcono: 'text-orange-500',
                        colorFondo: 'bg-orange-100 dark:bg-orange-400/10',
                        loading: false
                    },
                    {
                        titulo: 'Subsectores',
                        valor: data.subsectores.length,
                        subtitulo: `${data.subsectores.filter(ss => ss.estado === 'Activo').length} activos registrados`,
                        icono: 'pi-share-alt',
                        colorIcono: 'text-cyan-500',
                        colorFondo: 'bg-cyan-100 dark:bg-cyan-400/10',
                        loading: false
                    },
                    {
                        titulo: 'Instituciones',
                        valor: data.instituciones.length,
                        subtitulo: `${data.instituciones.filter(i => i.estado === 'Activo').length} activas funcionando`,
                        icono: 'pi-home',
                        colorIcono: 'text-purple-500',
                        colorFondo: 'bg-purple-100 dark:bg-purple-400/10',
                        loading: false
                    }
                ]);
            },
            error: (error) => {
                console.error('Error al cargar estadísticas de configuración:', error);
                // En caso de error, mantener las cards con valores por defecto
                this.cardsConfiguracion.update(cards => cards.map(card => ({
                    ...card,
                    loading: false
                })));
            }
        });
    }

    cargarEstadisticasObjetivos(): void {
        // Solo cargar si el usuario es planificador
        if (!this.esPlanificador()) {
            return;
        }

        forkJoin({
            objetivosInstitucionales: this.objetivoInstitucionalService.getObjetivosInstitucionales(),
            objetivosDesarrolloSostenible: this.objetivoDesarrolloSostenibleService.getObjetivosDesarrolloSostenible(),
            planesNacionalesDesarrollo: this.planNacionalDesarrolloService.getPlanesNacionalesDesarrollo()
        }).subscribe({
            next: (data) => {
                const totalObjetivos = data.objetivosInstitucionales.length +
                                     data.objetivosDesarrolloSostenible.length +
                                     data.planesNacionalesDesarrollo.length;

                const objetivosActivos = data.objetivosInstitucionales.filter(obj => obj.estado === 'Activo').length +
                                       data.objetivosDesarrolloSostenible.filter(ods => ods.estado === 'Activo').length +
                                       data.planesNacionalesDesarrollo.filter(plan => plan.estado === 'Activo').length;

                const porcentajeAlineacion = StatsWidget.obtenerPorcentajeActivos(objetivosActivos, totalObjetivos);

                this.cardsObjetivos.set([
                    {
                        titulo: 'Objetivos Institucionales',
                        valor: data.objetivosInstitucionales.length,
                        subtitulo: `${data.objetivosInstitucionales.filter(obj => obj.estado === 'Activo').length} activos planificados`,
                        icono: 'pi-flag',
                        colorIcono: 'text-green-500',
                        colorFondo: 'bg-green-100 dark:bg-green-400/10',
                        loading: false
                    },
                    {
                        titulo: 'ODS',
                        valor: data.objetivosDesarrolloSostenible.length,
                        subtitulo: `${data.objetivosDesarrolloSostenible.filter(ods => ods.estado === 'Activo').length} activos sostenibles`,
                        icono: 'pi-globe',
                        colorIcono: 'text-teal-500',
                        colorFondo: 'bg-teal-100 dark:bg-teal-400/10',
                        loading: false
                    },
                    {
                        titulo: 'Planes Nacionales',
                        valor: data.planesNacionalesDesarrollo.length,
                        subtitulo: `${data.planesNacionalesDesarrollo.filter(plan => plan.estado === 'Activo').length} activos de desarrollo`,
                        icono: 'pi-chart-line',
                        colorIcono: 'text-indigo-500',
                        colorFondo: 'bg-indigo-100 dark:bg-indigo-400/10',
                        loading: false
                    },
                    {
                        titulo: 'Alineación Total',
                        valor: porcentajeAlineacion,
                        subtitulo: `${objetivosActivos} objetivos estratégicos`,
                        sufijo: '%',
                        icono: 'pi-compass',
                        colorIcono: 'text-pink-500',
                        colorFondo: 'bg-pink-100 dark:bg-pink-400/10',
                        loading: false
                    }
                ]);
            },
            error: (error) => {
                console.error('Error al cargar estadísticas de objetivos:', error);
                // En caso de error, mantener las cards con valores por defecto
                this.cardsObjetivos.update(cards => cards.map(card => ({
                    ...card,
                    loading: false
                })));
            }
        });
    }

    /**
     * Carga las últimas 10 instituciones activas
     */
    cargarUltimasInstituciones(): void {
        // No cargar si es administrador
        if (this.esAdministrador()) {
            return;
        }

        this.loadingInstituciones.set(true);
        this.institucionService.getInstituciones().subscribe({
            next: (instituciones) => {
                // Filtrar solo instituciones activas, ordenar por ID descendente
                // y tomar solo las primeras 10
                this.ultimasInstituciones.set(instituciones
                    .filter(institucion => institucion.estado === 'Activo')
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 10)
                );
                this.loadingInstituciones.set(false);
            },
            error: (error) => {
                console.error('Error al cargar instituciones:', error);
                this.ultimasInstituciones.set([]);
                this.loadingInstituciones.set(false);
            }
        });
    }

    /**
     * Método para refrescar todas las estadísticas
     */
    refrescarTodasLasEstadisticas(): void {
        // Limpiar datos actuales
        this.usuarioActual.set(null);
        this.cardsConfiguracion.set([]);
        this.cardsObjetivos.set([]);
        this.cardsUsuariosRoles.set([]);
        this.ultimasInstituciones.set([]);
        this.tipologias.set([]);
        this.actividades.set([]);
        this.tipologiasActividades.set([]);
        this.usuarios.set([]);
        this.roles.set([]);
        
        // Obtener usuario actual y cargar datos correspondientes
        this.obtenerUsuarioActual();
    }

    /**
     * Obtiene el usuario actual para verificar sus roles
     */
    private obtenerUsuarioActual(): void {
        this.usuarioService.getMe().subscribe({
            next: (usuario) => {
                this.usuarioActual.set(usuario);
                
                // Inicializar skeletons después de conocer el rol
                this.inicializarSkeletons();
                
                // Cargar datos específicos según el rol
                if (usuario?.roles?.includes('Administrador')) {
                    // Solo cargar datos de usuarios y roles para administradores
                    this.cargarEstadisticasUsuariosRoles();
                } else {
                    // Para otros roles cargar datos del dashboard general
                    this.cargarEstadisticasConfiguracion();
                    this.cargarUltimasInstituciones();
                    this.cargarDatosProyectos();
                    
                    if (usuario?.roles?.includes('Planificador')) {
                        this.cargarEstadisticasObjetivos();
                    }
                }
            },
            error: (error) => {
                console.error('Error al obtener usuario actual:', error);
                this.usuarioActual.set(null);
                // En caso de error, no cargar ningún dato
            }
        });
    }

    /**
     * Carga las estadísticas de usuarios y roles (solo para administradores)
     */
    private cargarEstadisticasUsuariosRoles(): void {
        // Solo cargar si el usuario es administrador
        if (!this.esAdministrador()) {
            return;
        }

        this.loadingUsuariosRoles.set(true);
        
        // Inicializar skeleton para usuarios y roles
        this.cardsUsuariosRoles.set([
            {
                titulo: 'Total Usuarios',
                valor: 0,
                subtitulo: '',
                icono: 'pi-users',
                colorIcono: 'text-emerald-500',
                colorFondo: 'bg-emerald-100 dark:bg-emerald-400/10',
                loading: true
            },
            {
                titulo: 'Usuarios Activos',
                valor: 0,
                subtitulo: '',
                icono: 'pi-user-plus',
                colorIcono: 'text-lime-500',
                colorFondo: 'bg-lime-100 dark:bg-lime-400/10',
                loading: true
            },
            {
                titulo: 'Roles Disponibles',
                valor: 0,
                subtitulo: '',
                icono: 'pi-shield',
                colorIcono: 'text-amber-500',
                colorFondo: 'bg-amber-100 dark:bg-amber-400/10',
                loading: true
            },
            {
                titulo: 'Roles Activos',
                valor: 0,
                subtitulo: '',
                icono: 'pi-verified',
                colorIcono: 'text-rose-500',
                colorFondo: 'bg-rose-100 dark:bg-rose-400/10',
                loading: true
            }
        ]);

        forkJoin({
            usuarios: this.usuarioService.getUsuarios(),
            roles: this.rolService.getRoles()
        }).subscribe({
            next: (data) => {
                // Actualizar signals con los datos
                this.usuarios.set(data.usuarios);
                this.roles.set(data.roles);
                
                const usuariosActivos = data.usuarios.filter(u => u.estado === 'Activo' && !u.eliminado);
                const rolesActivos = data.roles.filter(r => r.estado === 'Activo');

                this.cardsUsuariosRoles.set([
                    {
                        titulo: 'Total Usuarios',
                        valor: data.usuarios.filter(u => !u.eliminado).length,
                        subtitulo: `${usuariosActivos.length} usuarios activos`,
                        icono: 'pi-users',
                        colorIcono: 'text-emerald-500',
                        colorFondo: 'bg-emerald-100 dark:bg-emerald-400/10',
                        loading: false
                    },
                    {
                        titulo: 'Usuarios Activos',
                        valor: usuariosActivos.length,
                        subtitulo: `${data.usuarios.filter(u => u.estado === 'Inactivo' && !u.eliminado).length} inactivos`,
                        icono: 'pi-user-plus',
                        colorIcono: 'text-lime-500',
                        colorFondo: 'bg-lime-100 dark:bg-lime-400/10',
                        loading: false
                    },
                    {
                        titulo: 'Roles Disponibles',
                        valor: data.roles.length,
                        subtitulo: `${rolesActivos.length} roles activos`,
                        icono: 'pi-shield',
                        colorIcono: 'text-amber-500',
                        colorFondo: 'bg-amber-100 dark:bg-amber-400/10',
                        loading: false
                    },
                    {
                        titulo: 'Roles Activos',
                        valor: rolesActivos.length,
                        subtitulo: `${data.roles.filter(r => r.estado === 'Inactivo').length} roles inactivos`,
                        icono: 'pi-verified',
                        colorIcono: 'text-rose-500',
                        colorFondo: 'bg-rose-100 dark:bg-rose-400/10',
                        loading: false
                    }
                ]);
                
                this.loadingUsuariosRoles.set(false);
            },
            error: (error) => {
                console.error('Error al cargar estadísticas de usuarios y roles:', error);
                // En caso de error, mantener las cards con valores por defecto
                this.cardsUsuariosRoles.update(cards => cards.map(card => ({
                    ...card,
                    loading: false
                })));
                this.loadingUsuariosRoles.set(false);
            }
        });
    }
}
