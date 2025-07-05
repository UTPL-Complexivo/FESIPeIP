import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget, StatCard } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { MacroSectorService } from '../../service/macro-sector.service';
import { SectorService } from '../../service/sector.service';
import { SubSectorService } from '../../service/sub-sector.service';
import { InstitucionService } from '../../service/institucion.service';
import { ObjetivoInstitucionalService } from '../../service/objetivo-institucional.service';
import { ObjetivoDesarrolloSostenibleService } from '../../service/objetivo-desarrollo-sostenible.service';
import { PlanNacionalDesarrolloService } from '../../service/plan-nacional-desarrollo.service';
import { InstitucionModel } from '../../models/institucion.model';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <!-- Estadísticas de Configuración Institucional -->
            <app-stats-widget class="contents" [cards]="cardsConfiguracion" />

            <!-- Estadísticas de Objetivos Estratégicos -->
            <app-stats-widget class="contents" [cards]="cardsObjetivos" />

            <div class="col-span-12 xl:col-span-6">
                <app-recent-sales-widget [instituciones]="ultimasInstituciones" [loading]="loadingInstituciones" />
                <app-best-selling-widget />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget />
            </div>
        </div>
    `
})
export class Dashboard implements OnInit {
    cardsConfiguracion: StatCard[] = [];
    cardsObjetivos: StatCard[] = [];
    ultimasInstituciones: InstitucionModel[] = [];
    loadingInstituciones: boolean = true;

    constructor(
        private macroSectorService: MacroSectorService,
        private sectorService: SectorService,
        private subSectorService: SubSectorService,
        private institucionService: InstitucionService,
        private objetivoInstitucionalService: ObjetivoInstitucionalService,
        private objetivoDesarrolloSostenibleService: ObjetivoDesarrolloSostenibleService,
        private planNacionalDesarrolloService: PlanNacionalDesarrolloService
    ) {}

    ngOnInit(): void {
        this.inicializarSkeletons();
        this.cargarEstadisticasConfiguracion();
        this.cargarEstadisticasObjetivos();
        this.cargarUltimasInstituciones();
    }

    /**
     * Inicializa las cards con estado de carga
     */
    inicializarSkeletons(): void {
        this.cardsConfiguracion = [
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
        ];

        this.cardsObjetivos = [
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
        ];
    }

    cargarEstadisticasConfiguracion(): void {
        forkJoin({
            macroSectores: this.macroSectorService.getMacroSectores(),
            sectores: this.sectorService.getSectores(),
            subsectores: this.subSectorService.getSubsectores(),
            instituciones: this.institucionService.getInstituciones()
        }).subscribe({
            next: (data) => {
                this.cardsConfiguracion = [
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
                ];
            },
            error: (error) => {
                console.error('Error al cargar estadísticas de configuración:', error);
                // En caso de error, mantener las cards con valores por defecto
                this.cardsConfiguracion = this.cardsConfiguracion.map(card => ({
                    ...card,
                    loading: false
                }));
            }
        });
    }

    cargarEstadisticasObjetivos(): void {
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

                this.cardsObjetivos = [
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
                ];
            },
            error: (error) => {
                console.error('Error al cargar estadísticas de objetivos:', error);
                // En caso de error, mantener las cards con valores por defecto
                this.cardsObjetivos = this.cardsObjetivos.map(card => ({
                    ...card,
                    loading: false
                }));
            }
        });
    }

    /**
     * Carga las últimas 10 instituciones activas
     */
    cargarUltimasInstituciones(): void {
        this.loadingInstituciones = true;
        this.institucionService.getInstituciones().subscribe({
            next: (instituciones) => {
                // Filtrar solo instituciones activas, ordenar por ID descendente
                // y tomar solo las primeras 10
                this.ultimasInstituciones = instituciones
                    .filter(institucion => institucion.estado === 'Activo')
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 10);
                this.loadingInstituciones = false;
            },
            error: (error) => {
                console.error('Error al cargar instituciones:', error);
                this.ultimasInstituciones = [];
                this.loadingInstituciones = false;
            }
        });
    }

    /**
     * Método para refrescar todas las estadísticas
     */
    refrescarTodasLasEstadisticas(): void {
        this.inicializarSkeletons();
        this.cargarEstadisticasConfiguracion();
        this.cargarEstadisticasObjetivos();
        this.cargarUltimasInstituciones();
    }
}
