import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { StatsWidget, StatCard } from './statswidget';
import { RecentSalesWidget } from './recentsaleswidget';
import { BestSellingWidget } from './bestsellingwidget';
import { RevenueStreamWidget } from './revenuestreamwidget';
import { AdminUsersWidget } from './adminuserswidget';
import { ObjetivosChartComponent } from './objetivos-chart.component';
import { AlineacionesChartComponent } from './alineaciones-chart.component';
import { AlineacionesResumenComponent } from './alineaciones-resumen.component';
import { MacroSectorService } from '../../../service/macro-sector.service';
import { SectorService } from '../../../service/sector.service';
import { SubSectorService } from '../../../service/sub-sector.service';
import { InstitucionService } from '../../../service/institucion.service';
import { ObjetivoInstitucionalService } from '../../../service/objetivo-institucional.service';
import { ObjetivoDesarrolloSostenibleService } from '../../../service/objetivo-desarrollo-sostenible.service';
import { PlanNacionalDesarrolloService } from '../../../service/plan-nacional-desarrollo.service';
import { TipologiaService } from '../../../service/tipologia.service';
import { ActividadService } from '../../../service/actividad.service';
import { TipologiaActividadService } from '../../../service/tipologia-actividad.service';
import { AlineacionService } from '../../../service/alineacion.service';
import { UsuarioService } from '../../../service/usuario.service';
import { RolService } from '../../../service/rol.service';
import { InstitucionModel } from '../../../models/institucion.model';
import { TipologiaModel } from '../../../models/tipologia.model';
import { ActividadModel } from '../../../models/actividad.model';
import { TipologiaActividadModel } from '../../../models/tipologia-actividad.model';
import { UsuarioModel } from '../../../models/usuario.model';
import { RolModel } from '../../../models/rol.model';
import { AlineacionModel } from '../../../models/alineacion.model';
import { PlanNacionalDesarrolloModel } from '../../../models/plan-nacional-desarrollo.model';
import { EstadoConfiguracionInstitucional } from '../../../shared/enums/estado-configuracion-institucional.enum';
import { EstadoObjetivosEstrategicos } from '../../../shared/enums/estado-objetivos-estrategicos.enum';

interface AlineacionPorEje {
    eje: string;
    total: number;
    activas: number;
    pendientesRevision: number;
    pendientesAutoridad: number;
    rechazadas: number;
    inactivas: number;
    color: string;
}

@Component({
    selector: 'app-dashboard-summary',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, AdminUsersWidget, ObjetivosChartComponent, AlineacionesChartComponent, AlineacionesResumenComponent],
    template: `
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
            <!-- Estadísticas de Configuración Institucional (planificadores) -->
            @if (esPlanificador()) {
                <app-stats-widget class="contents" [cards]="cardsConfiguracion()" />
            }

            <!-- Estadísticas de Objetivos Estratégicos (planificadores, revisores y autoridad validante) -->
            @if (esPlanificador() || esRevisor() || esAutoridadValidante()) {
                <app-stats-widget class="contents" [cards]="cardsObjetivos()" />
            }

            <!-- Widgets adicionales (solo planificadores) -->
            @if (esPlanificador()) {
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
                    <app-objetivos-chart />
                </div>
            }

            <!-- Widget simplificado para revisores y autoridad validante -->
            @if (esRevisor() || esAutoridadValidante()) {
                <div class="col-span-12 xl:col-span-6">
                    <app-objetivos-chart />
                </div>
                <div class="col-span-12 xl:col-span-6">
                    <app-alineaciones-chart />
                </div>
                <div class="col-span-12">
                    <app-alineaciones-resumen [alineacionesPorEje]="alineacionesPorEje()" [loading]="loadingAlineaciones()" />
                </div>
            }
        }
    `
})
export class DashboardSummaryComponent implements OnInit {
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
    private alineacionService = inject(AlineacionService);
    private usuarioService = inject(UsuarioService);
    private rolService = inject(RolService);

    // Mapa de colores para ejes (replicando la lógica del pipe)
    private colorMap: { [key: string]: string } = {
        'Social': '#8b5cf6',
        'Desarrollo Económico': '#14b8a6',
        'Infraestructura, Energia y Medio Ambiente': '#0ea5e9',
        'Institucional': '#6366f1',
        'Gestión de Riesgos': '#eab308'
    };

    // Método para obtener el color de un eje
    private getEjeColor(eje: string): string {
        return this.colorMap[eje] || '#6b7280';
    }

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

    // Signals para alineaciones (solo para revisores y autoridad validante)
    alineaciones = signal<AlineacionModel[]>([]);
    planesNacionalesDesarrollo = signal<PlanNacionalDesarrolloModel[]>([]);
    alineacionesPorEje = signal<AlineacionPorEje[]>([]);
    loadingAlineaciones = signal<boolean>(false);

    // Computed para verificar roles específicos
    esAdministrador = computed(() => {
        const usuario = this.usuarioActual();
        return usuario?.roles?.includes('Administrador') || false;
    });

    esPlanificador = computed(() => {
        const usuario = this.usuarioActual();
        return usuario?.roles?.includes('Planificador') || false;
    });

    esRevisor = computed(() => {
        const usuario = this.usuarioActual();
        return usuario?.roles?.includes('Revisor') || false;
    });

    esAutoridadValidante = computed(() => {
        const usuario = this.usuarioActual();
        return usuario?.roles?.includes('Autoridad') || false;
    });

    ngOnInit(): void {
        this.obtenerUsuarioActual();
    }

    /**
     * Carga todos los datos necesarios para el widget de proyectos
     */
    private cargarDatosProyectos(): void {
        // Solo cargar para planificadores
        if (!this.esPlanificador()) {
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
        // Si es administrador, no inicializar skeletons (se maneja por separado)
        if (this.esAdministrador()) {
            return;
        }

        // Cards de configuración institucional (solo para planificadores)
        if (this.esPlanificador()) {
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
        }

        // Cards de objetivos (para planificadores, revisores y autoridad validante)
        if (this.esPlanificador() || this.esRevisor() || this.esAutoridadValidante()) {
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
        // Solo cargar para planificadores
        if (!this.esPlanificador()) {
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
                        subtitulo: `${data.macroSectores.filter(ms => ms.estado === EstadoConfiguracionInstitucional.Activo).length} activos configurados`,
                        icono: 'pi-building',
                        colorIcono: 'text-blue-500',
                        colorFondo: 'bg-blue-100 dark:bg-blue-400/10',
                        loading: false
                    },
                    {
                        titulo: 'Sectores',
                        valor: data.sectores.length,
                        subtitulo: `${data.sectores.filter(s => s.estado === EstadoConfiguracionInstitucional.Activo).length} activos en total`,
                        icono: 'pi-sitemap',
                        colorIcono: 'text-orange-500',
                        colorFondo: 'bg-orange-100 dark:bg-orange-400/10',
                        loading: false
                    },
                    {
                        titulo: 'Subsectores',
                        valor: data.subsectores.length,
                        subtitulo: `${data.subsectores.filter(ss => ss.estado === EstadoConfiguracionInstitucional.Activo).length} activos registrados`,
                        icono: 'pi-share-alt',
                        colorIcono: 'text-cyan-500',
                        colorFondo: 'bg-cyan-100 dark:bg-cyan-400/10',
                        loading: false
                    },
                    {
                        titulo: 'Instituciones',
                        valor: data.instituciones.length,
                        subtitulo: `${data.instituciones.filter(i => i.estado === EstadoConfiguracionInstitucional.Activo).length} activas funcionando`,
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
        // Solo cargar si el usuario es planificador, revisor o autoridad validante
        if (!this.esPlanificador() && !this.esRevisor() && !this.esAutoridadValidante()) {
            return;
        }

        forkJoin({
            objetivosInstitucionales: this.objetivoInstitucionalService.getObjetivosInstitucionales(),
            objetivosDesarrolloSostenible: this.objetivoDesarrolloSostenibleService.getObjetivosDesarrolloSostenible(),
            planesNacionalesDesarrollo: this.planNacionalDesarrolloService.getPlanesNacionalesDesarrollo()
        }).subscribe({
            next: (data) => {
                // Para Autoridad Validante, filtrar solo objetivos en estado PendienteAutoridad
                let objetivosInstitucionales = data.objetivosInstitucionales;
                let objetivosDesarrolloSostenible = data.objetivosDesarrolloSostenible;
                let planesNacionalesDesarrollo = data.planesNacionalesDesarrollo;

                // Para Autoridad: los ODS y Planes Nacionales no requieren validación, solo son Activos/Inactivos
                if (this.esAutoridadValidante()) {
                    // Los objetivos institucionales sí requieren validación de autoridad
                    // Mostrar todos los objetivos institucionales para ver el panorama completo
                    objetivosInstitucionales = data.objetivosInstitucionales;

                    // ODS y Planes solo filtrar por activos (no requieren validación de autoridad)
                    objetivosDesarrolloSostenible = data.objetivosDesarrolloSostenible.filter(ods =>
                        ods.estado === EstadoConfiguracionInstitucional.Activo
                    );
                    planesNacionalesDesarrollo = data.planesNacionalesDesarrollo.filter(plan =>
                        plan.estado === EstadoConfiguracionInstitucional.Activo
                    );
                }

                const totalObjetivos = objetivosInstitucionales.length +
                                     objetivosDesarrolloSostenible.length +
                                     planesNacionalesDesarrollo.length;

                // Para Autoridad Validante: calcular objetivos pendientes de validación vs total
                const objetivosPendientesValidacion = this.esAutoridadValidante() ?
                    objetivosInstitucionales.filter(obj => obj.estado === EstadoObjetivosEstrategicos.PendienteAutoridad).length :
                    0;

                const objetivosActivosInstitucionales = objetivosInstitucionales.filter(obj => obj.estado === EstadoObjetivosEstrategicos.Activo).length;

                const objetivosActivos = this.esAutoridadValidante() ?
                    objetivosActivosInstitucionales +
                    objetivosDesarrolloSostenible.length + // Ya filtrados por activos
                    planesNacionalesDesarrollo.length : // Ya filtrados por activos
                    objetivosActivosInstitucionales +
                    objetivosDesarrolloSostenible.filter(ods => ods.estado === EstadoConfiguracionInstitucional.Activo).length +
                    planesNacionalesDesarrollo.filter(plan => plan.estado === EstadoConfiguracionInstitucional.Activo).length;

                // Para Autoridad: el porcentaje debe ser específico de objetivos institucionales
                const porcentajeAlineacion = this.esAutoridadValidante() ?
                    StatsWidget.obtenerPorcentajeActivos(objetivosPendientesValidacion, objetivosInstitucionales.length) :
                    StatsWidget.obtenerPorcentajeActivos(objetivosActivos, totalObjetivos);

                // Personalizar textos según el rol
                const subtituloObjetivos = this.esAutoridadValidante() ?
                    `${objetivosPendientesValidacion} pendientes de validación` :
                    `${objetivosActivosInstitucionales} activos planificados`;

                const subtituloODS = this.esAutoridadValidante() ?
                    `${objetivosDesarrolloSostenible.length} activos disponibles` :
                    `${objetivosDesarrolloSostenible.filter(ods => ods.estado === EstadoConfiguracionInstitucional.Activo).length} activos sostenibles`;

                const subtituloPlanes = this.esAutoridadValidante() ?
                    `${planesNacionalesDesarrollo.length} activos disponibles` :
                    `${planesNacionalesDesarrollo.filter(plan => plan.estado === EstadoConfiguracionInstitucional.Activo).length} activos de desarrollo`;

                const subtituloAlineacion = this.esAutoridadValidante() ?
                    `${objetivosActivosInstitucionales} activos, ${objetivosPendientesValidacion} pendientes` :
                    `${objetivosActivos} objetivos estratégicos`;

                this.cardsObjetivos.set([
                    {
                        titulo: 'Objetivos Institucionales',
                        valor: objetivosInstitucionales.length,
                        subtitulo: subtituloObjetivos,
                        icono: 'pi-flag',
                        colorIcono: 'text-green-500',
                        colorFondo: 'bg-green-100 dark:bg-green-400/10',
                        loading: false
                    },
                    {
                        titulo: 'ODS',
                        valor: objetivosDesarrolloSostenible.length,
                        subtitulo: subtituloODS,
                        icono: 'pi-globe',
                        colorIcono: 'text-teal-500',
                        colorFondo: 'bg-teal-100 dark:bg-teal-400/10',
                        loading: false
                    },
                    {
                        titulo: 'Planes Nacionales',
                        valor: planesNacionalesDesarrollo.length,
                        subtitulo: subtituloPlanes,
                        icono: 'pi-chart-line',
                        colorIcono: 'text-indigo-500',
                        colorFondo: 'bg-indigo-100 dark:bg-indigo-400/10',
                        loading: false
                    },
                    {
                        titulo: this.esAutoridadValidante() ? 'Validación Pendiente' : 'Alineación Total',
                        valor: porcentajeAlineacion,
                        subtitulo: subtituloAlineacion,
                        sufijo: '%',
                        icono: this.esAutoridadValidante() ? 'pi-clock' : 'pi-compass',
                        colorIcono: this.esAutoridadValidante() ? 'text-orange-500' : 'text-pink-500',
                        colorFondo: this.esAutoridadValidante() ? 'bg-orange-100 dark:bg-orange-400/10' : 'bg-pink-100 dark:bg-pink-400/10',
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
        // Solo cargar para planificadores
        if (!this.esPlanificador()) {
            return;
        }

        this.loadingInstituciones.set(true);
        this.institucionService.getInstituciones().subscribe({
            next: (instituciones) => {
                // Filtrar solo instituciones activas, ordenar por ID descendente
                // y tomar solo las primeras 10
                this.ultimasInstituciones.set(instituciones
                    .filter(institucion => institucion.estado === EstadoConfiguracionInstitucional.Activo)
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
                } else if (usuario?.roles?.includes('Revisor')) {
                    // Para revisores cargar objetivos y alineaciones
                    this.cargarEstadisticasObjetivos();
                    this.cargarDatosAlineaciones();
                } else if (usuario?.roles?.includes('Autoridad')) {
                    // Para autoridad validante cargar objetivos pendientes de validación y alineaciones
                    this.cargarEstadisticasObjetivos();
                    this.cargarDatosAlineaciones();
                } else {
                    // Para planificadores cargar datos completos del dashboard
                    this.cargarEstadisticasConfiguracion();
                    this.cargarUltimasInstituciones();
                    this.cargarDatosProyectos();
                    this.cargarEstadisticasObjetivos();
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

    /**
     * Carga las alineaciones y las procesa por eje (solo para revisores y autoridad validante)
     */
    private cargarDatosAlineaciones(): void {
        // Solo cargar si el usuario es revisor o autoridad validante
        if (!this.esRevisor() && !this.esAutoridadValidante()) {
            return;
        }

        this.loadingAlineaciones.set(true);

        forkJoin({
            alineaciones: this.alineacionService.getAlineaciones(),
            planesNacionalesDesarrollo: this.planNacionalDesarrolloService.getPlanesNacionalesDesarrollo()
        }).subscribe({
            next: (data) => {
                this.alineaciones.set(data.alineaciones);
                this.planesNacionalesDesarrollo.set(data.planesNacionalesDesarrollo);
                this.procesarAlineacionesPorEje();
                this.loadingAlineaciones.set(false);
            },
            error: (error) => {
                console.error('Error al cargar datos de alineaciones:', error);
                this.loadingAlineaciones.set(false);
            }
        });
    }

    /**
     * Procesa las alineaciones agrupándolas por eje estratégico
     */
    private procesarAlineacionesPorEje(): void {
        const alineaciones = this.alineaciones();
        const planes = this.planesNacionalesDesarrollo();

        // Para el resumen detallado, mostrar TODAS las alineaciones
        // sin filtrar por rol para tener el panorama completo
        const alineacionesFiltradas = alineaciones;

        // Crear mapa de ejes desde los planes nacionales
        const ejesPorPlan = new Map<number, string>();
        planes.forEach(plan => {
            ejesPorPlan.set(plan.id, plan.eje);
        });

        // Agrupar alineaciones por eje
        const alineacionesPorEje = new Map<string, AlineacionPorEje>();

        alineacionesFiltradas.forEach(alineacion => {
            const eje = ejesPorPlan.get(alineacion.planNacionalDesarrolloId) || 'Sin Eje';

            if (!alineacionesPorEje.has(eje)) {
                alineacionesPorEje.set(eje, {
                    eje,
                    total: 0,
                    activas: 0,
                    pendientesRevision: 0,
                    pendientesAutoridad: 0,
                    rechazadas: 0,
                    inactivas: 0,
                    color: this.getEjeColor(eje)
                });
            }

            const ejeData = alineacionesPorEje.get(eje)!;
            ejeData.total++;

            // Contar por estado
            switch (alineacion.estado) {
                case EstadoObjetivosEstrategicos.Activo:
                    ejeData.activas++;
                    break;
                case EstadoObjetivosEstrategicos.PendienteRevision:
                    ejeData.pendientesRevision++;
                    break;
                case EstadoObjetivosEstrategicos.PendienteAutoridad:
                    ejeData.pendientesAutoridad++;
                    break;
                case EstadoObjetivosEstrategicos.Rechazado:
                    ejeData.rechazadas++;
                    break;
                case EstadoObjetivosEstrategicos.Inactivo:
                    ejeData.inactivas++;
                    break;
            }
        });

        // Convertir a array y ordenar por eje
        const alineacionesArray = Array.from(alineacionesPorEje.values())
            .sort((a, b) => a.eje.localeCompare(b.eje));

        this.alineacionesPorEje.set(alineacionesArray);
    }
}
