import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TipologiaActividadService } from '../../../service/tipologia-actividad.service';
import { TipologiaService } from '../../../service/tipologia.service';
import { ActividadService } from '../../../service/actividad.service';
import { TipologiaActividadModel } from '../../../models/tipologia-actividad.model';
import { TipologiaModel } from '../../../models/tipologia.model';
import { ActividadModel } from '../../../models/actividad.model';
import { AppDetallePrincipal } from "../../../layout/component/app.detalle-principal";
import { AppToolbarCrud } from "../../../layout/component/app.toolbar-crud";

@Component({
    selector: 'app-tipologia-actividad-editar',
    standalone: true,
    template: `<div class="card">
            <app-detalle-principal [items]="items" [titulo]="nombre"></app-detalle-principal>
            <form [formGroup]="tipologiaActividadForm" (ngSubmit)="onSubmit()">
                <app-toolbar-crud [linkRegreso]="'/proyecto-inversion/tipologia-actividad'" [grabando]="grabando" [initializeUserForm]="initializeUserForm.bind(this)" [mostrarReset]="false"></app-toolbar-crud>
                <div class="p-fluid">
                    <div class="p-field mt-8 mb-6">
                        <p-floatLabel>
                            <input id="id" type="text" pInputText formControlName="id" class="w-1/5" />
                            <label for="id">Id</label>
                        </p-floatLabel>
                        @if (tipologiaActividadForm.get('id')?.invalid && tipologiaActividadForm.get('id')?.touched) {
                            @if (tipologiaActividadForm.get('id')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El ID es requerido." />
                            }
                        }
                    </div>
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <p-select id="tipologiaId" formControlName="tipologiaId" [options]="tipologias" optionLabel="nombre" optionValue="id" class="w-1/2" placeholder="Seleccionar tipología" />
                            <label for="tipologiaId">Tipología</label>
                        </p-floatLabel>
                        @if (tipologiaActividadForm.get('tipologiaId')?.invalid && tipologiaActividadForm.get('tipologiaId')?.touched) {
                            @if (tipologiaActividadForm.get('tipologiaId')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="La tipología es requerida." />
                            }
                        }
                    </div>
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <p-select id="actividadId" formControlName="actividadId" [options]="actividades" optionLabel="nombre" optionValue="id" class="w-1/2" placeholder="Seleccionar actividad" [filter]="true" />
                            <label for="actividadId">Actividad</label>
                        </p-floatLabel>
                        @if (tipologiaActividadForm.get('actividadId')?.invalid && tipologiaActividadForm.get('actividadId')?.touched) {
                            @if (tipologiaActividadForm.get('actividadId')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="La actividad es requerida." />
                            }
                        }
                    </div>
                </div>
            </form>
        </div>`,
    imports: [BreadcrumbModule, RouterModule, CommonModule, ReactiveFormsModule, ToolbarModule, ButtonModule, FloatLabelModule, MessageModule, ToastModule, InputTextModule, SelectModule, AppDetallePrincipal, AppToolbarCrud],
    providers: [MessageService]
})
export class TipologiaActividadEditarComponent implements OnInit {
    items: MenuItem[] = [];
    tipologiaActividadForm!: FormGroup;
    grabando = false;
    nombre = '';
    tipologiaActividad!: TipologiaActividadModel;
    tipologias: TipologiaModel[] = [];
    actividades: ActividadModel[] = [];
    id: number = 0;

    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private tipologiaActividadService: TipologiaActividadService,
        private tipologiaService: TipologiaService,
        private actividadService: ActividadService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.items = [
            { icon: 'pi pi-home', route: '/' },
            { label: 'Proyecto de Inversión' },
            { label: 'Tipologías - Actividades', route: '/proyecto-inversion/tipologia-actividad' },
            { label: 'Editar', route: '/proyecto-inversion/tipologia-actividad/editar' }
        ];
        this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.initializeUserForm();
        this.loadTipologias();
        this.loadActividades();
        this.loadTipologiaActividad();
    }

    loadTipologias() {
        this.tipologiaService.getTipologias().subscribe({
            next: (data) => {
                this.tipologias = data.filter(t => t.estado === 'Activo');
            },
            error: (error) => {
                console.error('Error al cargar tipologías:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las tipologías.' });
            }
        });
    }

    loadActividades() {
        this.actividadService.getActividades().subscribe({
            next: (data) => {
                this.actividades = data.filter(a => a.estado === 'Activo');
            },
            error: (error) => {
                console.error('Error al cargar actividades:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las actividades.' });
            }
        });
    }

    loadTipologiaActividad() {
        this.tipologiaActividadService.getTipologiaActividadById(this.id).subscribe({
            next: (data) => {
                this.tipologiaActividadForm.patchValue({
                    id: data.id,
                    tipologiaId: data.tipologiaId,
                    actividadId: data.actividadId
                });
                this.tipologiaActividad = data;
                this.nombre = `Editar Tipología-Actividad: ${data.tipologiaNombre} - ${data.actividadNombre}`;
            },
            error: (error) => {
                console.error('Error al obtener la tipología-actividad:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la tipología-actividad.' });
            }
        });
    }

    initializeUserForm() {
        this.tipologiaActividadForm = this.fb.group({
            id: [{ value: '', disabled: true }],
            tipologiaId: ['', [Validators.required]],
            actividadId: ['', [Validators.required]]
        });
        this.tipologiaActividadForm.markAsUntouched();
    }

    onSubmit() {
        if (this.tipologiaActividadForm.invalid) {
            this.tipologiaActividadForm.markAllAsTouched();
            return;
        }

        this.grabando = true;

        // Obtener los nombres actualizados
        const tipologiaSeleccionada = this.tipologias.find(t => t.id === this.tipologiaActividadForm.value.tipologiaId);
        const actividadSeleccionada = this.actividades.find(a => a.id === this.tipologiaActividadForm.value.actividadId);

        const tipologiaActividadData: TipologiaActividadModel = {
            ...this.tipologiaActividad,
            tipologiaId: this.tipologiaActividadForm.value.tipologiaId,
            actividadId: this.tipologiaActividadForm.value.actividadId,
            tipologiaNombre: tipologiaSeleccionada?.nombre || this.tipologiaActividad.tipologiaNombre,
            actividadNombre: actividadSeleccionada?.nombre || this.tipologiaActividad.actividadNombre,
            tipologiaCodigo: tipologiaSeleccionada?.codigo || this.tipologiaActividad.tipologiaCodigo
        };

        this.tipologiaActividadService.updateTipologiaActividad(this.id, tipologiaActividadData).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
            },
            error: (error) => {
                console.error('Error al actualizar la tipología-actividad:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la tipología-actividad.' });
                this.grabando = false;
            },
            complete: () => {

                this.grabando = false;
            }
        });
    }
}
