import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AppDetallePrincipal } from '../../../layout/component/app.detalle-principal';
import { AppToolbarCrud } from '../../../layout/component/app.toolbar-crud';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ObjetivoInstitucionalService } from '../../../service/objetivo-institucional.service';
import { ObjetivoDesarrolloSostenibleService } from '../../../service/objetivo-desarrollo-sostenible.service';
import { PlanNacionalDesarrolloService } from '../../../service/plan-nacional-desarrollo.service';
import { AlineacionService } from '../../../service/alineacion.service';
import { ObjetivoInstitucionalModel } from '../../../models/objetivo-institucional.model';
import { ObjetivoDesarrolloSostenibleModel } from '../../../models/objetivo-desarrollo-sostenible.model';
import { PlanNacionalDesarrolloModel } from '../../../models/plan-nacional-desarrollo.model';
import { AlineacionModel } from '../../../models/alineacion.model';
import { EjeColorPipe } from '../../../pipes/eje-color.pipe';
import { EstadoObjetivosEstrategicos } from '../../../shared/enums/estado-objetivos-estrategicos.enum';
import { ActiveApproveFilterPipe } from "../../../pipes/active-approve-filter.pipe";
import { ActiveFilterPipe } from "../../../pipes/active-filter.pipe";

// Extender la interfaz para incluir displayName
interface PlanNacionalDesarrolloExtendido extends PlanNacionalDesarrolloModel {
    displayName?: string;
}

// Extender la interfaz de ODS para incluir displayName
interface ObjetivoDesarrolloSostenibleExtendido extends ObjetivoDesarrolloSostenibleModel {
    displayName?: string;
}

// Interfaz para la estructura agrupada
interface GrupoPND {
    label: string;
    items: PlanNacionalDesarrolloExtendido[];
}

@Component({
    selector: 'app-alineacion-editar',
    standalone: true,
    template: `
        <div class="card">
            <app-detalle-principal [items]="items" titulo="Editar Alineación"></app-detalle-principal>
            <form [formGroup]="alineacionForm" (ngSubmit)="onSubmit()">
                <app-toolbar-crud
                    [linkRegreso]="'/objetivo-estrategico/alineacion'"
                    [grabando]="grabando"
                    [initializeUserForm]="initializeForm.bind(this)"
                    [mostrarReset]="false">
                </app-toolbar-crud>

                <div class="p-fluid">
                    <!-- Objetivo Institucional -->
                    <div class="p-field mt-8 mb-6">
                        <p-float-label>
                            <p-select
                                id="objetivoInstitucional"
                                formControlName="objetivoInstitucionalId"
                                [options]="objetivosInstitucionales | activeApproveFilter"
                                optionLabel="nombre"
                                optionValue="id"
                                [showClear]="true"
                                class="w-full">
                            </p-select>
                            <label for="objetivoInstitucional">Objetivo Institucional</label>
                        </p-float-label>
                        @if (alineacionForm.get('objetivoInstitucionalId')?.invalid && alineacionForm.get('objetivoInstitucionalId')?.touched) {
                            @if (alineacionForm.get('objetivoInstitucionalId')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El Objetivo Institucional es requerido." />
                            }
                        }
                    </div>

                    <!-- Plan Nacional de Desarrollo -->
                    <div class="p-field mb-6">
                        <p-float-label>
                            <p-select
                                id="planNacionalDesarrollo"
                                formControlName="planNacionalDesarrolloId"
                                [options]="planesNacionalesDesarrollo"
                                optionLabel="nombre"
                                optionValue="id"
                                [group]="true"
                                [showClear]="true"
                                class="w-full">
                                <ng-template #selectedItem let-item>
                                    <div class="flex items-center gap-3">
                                        <div [class]="'w-3 h-3 rounded-full ' + (item.eje | ejeColor:'background')"></div>
                                        <div class="flex flex-col">
                                            <span class="font-medium">{{ item.nombre }}</span>
                                            <span class="text-xs text-gray-500">Eje: {{ item.eje }}</span>
                                        </div>
                                    </div>
                                </ng-template>
                                <ng-template #item let-item>
                                    <div class="flex items-center gap-3 py-2">
                                        <div [class]="'w-2 h-8 rounded ' + (item.eje | ejeColor:'background')"></div>
                                        <div class="flex flex-col flex-1">
                                            <span class="font-medium">{{ item.nombre }}</span>
                                            @if (item.descripcion) {
                                                <span class="text-sm text-gray-500 mt-1">{{ item.descripcion }}</span>
                                            }
                                        </div>
                                    </div>
                                </ng-template>
                                <ng-template #group let-group>
                                    <div [class]="'flex items-center gap-2 font-bold text-white px-3 py-2 border-l-4 border-white ' + (group.label | ejeColor:'background')">
                                        <i class="pi pi-sitemap text-white"></i>
                                        <span>EJE {{ group.label }}</span>
                                    </div>
                                </ng-template>
                            </p-select>
                            <label for="planNacionalDesarrollo">Objetivo PND</label>
                        </p-float-label>
                        @if (alineacionForm.get('planNacionalDesarrolloId')?.invalid && alineacionForm.get('planNacionalDesarrolloId')?.touched) {
                            @if (alineacionForm.get('planNacionalDesarrolloId')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El Objetivo PND es requerido." />
                            }
                        }
                    </div>

                    <!-- Objetivo de Desarrollo Sostenible -->
                    <div class="p-field mb-6">
                        <p-float-label>
                            <p-select
                                id="objetivoDesarrolloSostenible"
                                formControlName="objetivoDesarrolloSostenibleId"
                                [options]="objetivosDesarrolloSostenible | activeFilter:true"
                                optionLabel="displayName"
                                optionValue="id"
                                [showClear]="true"
                                class="w-full">
                                <ng-template #selectedItem let-item>
                                    <div class="flex items-center gap-2">
                                        <img [src]="item.icono" alt="ODS" class="w-8 h-8" />
                                        <span>{{ item.codigo }} - {{ item.nombre }}</span>
                                    </div>
                                </ng-template>
                                <ng-template #item let-item>
                                    <div class="flex items-center gap-2">
                                        <img [src]="item.icono" alt="ODS" class="w-8 h-8" />
                                        <div class="flex flex-col">
                                            <span class="font-medium">{{ item.codigo }} - {{ item.nombre }}</span>
                                            @if (item.descripcion) {
                                                <span class="text-sm text-gray-500 mt-1">{{ item.descripcion }}</span>
                                            }
                                        </div>
                                    </div>
                                </ng-template>
                            </p-select>
                            <label for="objetivoDesarrolloSostenible">Objetivo de Desarrollo Sostenible</label>
                        </p-float-label>
                        @if (alineacionForm.get('objetivoDesarrolloSostenibleId')?.invalid && alineacionForm.get('objetivoDesarrolloSostenibleId')?.touched) {
                            @if (alineacionForm.get('objetivoDesarrolloSostenibleId')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El ODS es requerido." />
                            }
                        }
                    </div>
                </div>
            </form>
        </div>
        <p-toast position="top-right"></p-toast>
    `,
    imports: [
    ReactiveFormsModule,
    AppDetallePrincipal,
    AppToolbarCrud,
    FloatLabelModule,
    SelectModule,
    MessageModule,
    ToastModule,
    ActiveApproveFilterPipe,
    EjeColorPipe,
    ActiveFilterPipe
],
    providers: [MessageService]
})
export class AlineacionEditarComponent implements OnInit {
    items: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Objetivos Estratégicos' },
        { label: 'Alineación' },
        { label: 'Editar' }
    ];

    alineacionForm!: FormGroup;
    grabando = false;
    alineacionId: number = 0;
    alineacion: AlineacionModel | null = null;

    // Datos para los selects
    objetivosInstitucionales: ObjetivoInstitucionalModel[] = [];
    planesNacionalesDesarrollo: GrupoPND[] = [];
    objetivosDesarrolloSostenible: ObjetivoDesarrolloSostenibleExtendido[] = [];

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private objetivoInstitucionalService: ObjetivoInstitucionalService,
        private odsService: ObjetivoDesarrolloSostenibleService,
        private pndService: PlanNacionalDesarrolloService,
        private alineacionService: AlineacionService
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.getAlineacionId();
        this.loadData();
    }

    initializeForm() {
        this.alineacionForm = this.fb.group({
            objetivoInstitucionalId: [null, Validators.required],
            planNacionalDesarrolloId: [null, Validators.required],
            objetivoDesarrolloSostenibleId: [null, Validators.required]
        });
    }

    getAlineacionId() {
        this.route.params.subscribe(params => {
            this.alineacionId = +params['id'];
            if (this.alineacionId) {
                this.loadAlineacion();
            }
        });
    }

    loadAlineacion() {
        this.alineacionService.getAlineacionById(this.alineacionId).subscribe({
            next: (alineacion) => {
                this.alineacion = alineacion;

                // Mostrar mensaje de advertencia si la alineación fue rechazada
                if (alineacion.estado === EstadoObjetivosEstrategicos.Rechazado) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: 'La alineación fue rechazada y se colocará en estado pendiente una vez guarde la información.'
                    });
                }

                this.alineacionForm.patchValue({
                    objetivoInstitucionalId: alineacion.objetivoInstitucionalId,
                    planNacionalDesarrolloId: alineacion.planNacionalDesarrolloId,
                    objetivoDesarrolloSostenibleId: alineacion.objetivoDesarrolloSostenibleId
                });
            },
            error: (error) => {
                console.error('Error al cargar alineación:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar la alineación.'
                });
                this.router.navigate(['/objetivo-estrategico/alineacion']);
            }
        });
    }

    loadData() {
        // Cargar Objetivos Institucionales
        this.objetivoInstitucionalService.getObjetivosInstitucionales().subscribe({
            next: (data) => {
                this.objetivosInstitucionales = data;
            },
            error: (error) => {
                console.error('Error al cargar objetivos institucionales:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los Objetivos Institucionales.'
                });
            }
        });

        // Cargar Planes Nacionales de Desarrollo
        this.pndService.getPlanesNacionalesDesarrollo().subscribe({
            next: (data) => {
                // Agrupar por eje estratégico
                const grouped = data.reduce((acc: any, pnd) => {
                    const eje = pnd.eje;
                    if (!acc[eje]) {
                        acc[eje] = [];
                    }
                    acc[eje].push(pnd);
                    return acc;
                }, {});

                // Ordenar los ejes estratégicos
                const ejesOrdenados = Object.keys(grouped).sort();

                // Convertir a formato requerido por p-select con [group]="true"
                this.planesNacionalesDesarrollo = ejesOrdenados.map(eje => ({
                    label: eje,
                    items: grouped[eje].sort((a: PlanNacionalDesarrolloModel, b: PlanNacionalDesarrolloModel) =>
                        a.nombre.localeCompare(b.nombre)
                    )
                }));
            },
            error: (error) => {
                console.error('Error al cargar planes nacionales:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los Objetivos PND.'
                });
            }
        });

        // Cargar Objetivos de Desarrollo Sostenible
        this.odsService.getObjetivosDesarrolloSostenible().subscribe({
            next: (data) => {
                // Agregar displayName para mostrar código y nombre
                this.objetivosDesarrolloSostenible = data.map(ods => ({
                    ...ods,
                    displayName: `${ods.codigo} - ${ods.nombre}`
                }));
            },
            error: (error) => {
                console.error('Error al cargar ODS:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los ODS.'
                });
            }
        });
    }

    onSubmit() {
        if (this.alineacionForm.invalid) {
            this.alineacionForm.markAllAsTouched();
            return;
        }

        if (!this.alineacion) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se ha cargado la alineación a editar.'
            });
            return;
        }

        this.grabando = true;

        const formValue = this.alineacionForm.value;
        const alineacionActualizada: AlineacionModel = {
            ...this.alineacion,
            objetivoInstitucionalId: formValue.objetivoInstitucionalId,
            planNacionalDesarrolloId: formValue.planNacionalDesarrolloId,
            objetivoDesarrolloSostenibleId: formValue.objetivoDesarrolloSostenibleId
        };

        this.alineacionService.updateAlineacion(this.alineacionId, alineacionActualizada).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: mensaje
                    });
                    return;
                }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: mensaje || 'La alineación se actualizó exitosamente.'
                });
            },
            error: (error) => {
                console.error('Error al actualizar la alineación:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo actualizar la alineación.'
                });
            },
            complete: () => {
                this.grabando = false;
            }
        });
    }
}
