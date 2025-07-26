import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar';
import { TipologiaActividadService } from '../../../service/tipologia-actividad.service';
import { TipologiaService } from '../../../service/tipologia.service';
import { ActividadService } from '../../../service/actividad.service';
import { TipologiaModel } from '../../../models/tipologia.model';
import { ActividadModel } from '../../../models/actividad.model';
import { AppDetallePrincipal } from "../../../layout/component/app.detalle-principal";
import { AppToolbarCrud } from "../../../layout/component/app.toolbar-crud";
import { EstadoConfiguracionInstitucional } from '../../../shared/enums/estado-configuracion-institucional.enum';

@Component({
    selector: 'app-tipologia-actividad-nuevo',
    standalone: true,
    template: `<div class="card">
        <app-detalle-principal [items]="items" titulo="Nueva Tipología - Actividad"></app-detalle-principal>
        <form [formGroup]="tipologiaActividadForm" (ngSubmit)="onSubmit()">
            <app-toolbar-crud [linkRegreso]="'/proyecto-inversion/tipologia-actividad'" [grabando]="grabando" [initializeUserForm]="initializeUserForm.bind(this)"></app-toolbar-crud>
            <div class="p-fluid">
                <div class="p-field mt-8 mb-6">
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
    </div>
    `,
    imports: [ReactiveFormsModule, BreadcrumbModule, CommonModule, RouterModule, SelectModule, ToolbarModule, ButtonModule, InputTextModule, FloatLabelModule, MessageModule, AppDetallePrincipal, AppToolbarCrud],
    providers: [MessageService]
})
export class TipologiaActividadNuevoComponent implements OnInit {
    tipologiaActividadForm!: FormGroup;
    items: MenuItem[] = [];
    grabando = false;
    tipologias: TipologiaModel[] = [];
    actividades: ActividadModel[] = [];

    constructor(
        private fb: FormBuilder,
        private tipologiaActividadService: TipologiaActividadService,
        private tipologiaService: TipologiaService,
        private actividadService: ActividadService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.items = [
            { icon: 'pi pi-home', route: '/' },
            { label: 'Proyecto de Inversión' },
            { label: 'Tipologías - Actividades', route: '/proyecto-inversion/tipologia-actividad' },
            { label: 'Nueva', route: '/proyecto-inversion/tipologia-actividad/nuevo' }
        ];
        this.initializeUserForm();
        this.loadTipologias();
        this.loadActividades();
    }

    initializeUserForm() {
        this.tipologiaActividadForm = this.fb.group({
            tipologiaId: ['', [Validators.required]],
            actividadId: ['', [Validators.required]]
        });
    }

    loadTipologias() {
        this.tipologiaService.getTipologias().subscribe({
            next: (data) => {
                this.tipologias = data.filter(t => t.estado === EstadoConfiguracionInstitucional.Activo);
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
                this.actividades = data.filter(a => a.estado === EstadoConfiguracionInstitucional.Activo);
            },
            error: (error) => {
                console.error('Error al cargar actividades:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las actividades.' });
            }
        });
    }

    onSubmit() {
        if (this.tipologiaActividadForm.invalid) {
            this.tipologiaActividadForm.markAllAsTouched();
            console.error('Formulario inválido', this.tipologiaActividadForm);
            return;
        }
        this.grabando = true;

        // Crear el objeto completo con los nombres
        const tipologiaSeleccionada = this.tipologias.find(t => t.id === this.tipologiaActividadForm.value.tipologiaId);
        const actividadSeleccionada = this.actividades.find(a => a.id === this.tipologiaActividadForm.value.actividadId);

        const tipologiaActividad = {
            id: 0, // Para nuevo registro
            tipologiaId: this.tipologiaActividadForm.value.tipologiaId,
            actividadId: this.tipologiaActividadForm.value.actividadId,
            tipologiaNombre: tipologiaSeleccionada?.nombre || '',
            actividadNombre: actividadSeleccionada?.nombre || '',
            tipologiaCodigo: tipologiaSeleccionada?.codigo || ''
        };

        this.tipologiaActividadService.addTipologiaActividad(tipologiaActividad).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                this.initializeUserForm();
            },
            error: (error) => {
                console.error('Error al guardar la tipología-actividad:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la tipología-actividad.' });
                this.grabando = false;
            },
            complete: () => {
                this.grabando = false;
            }
        });
    }
}
