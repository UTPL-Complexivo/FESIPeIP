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
import { MultiSelectModule } from 'primeng/multiselect';
import { ToolbarModule } from 'primeng/toolbar';
import { TextareaModule } from 'primeng/textarea';
import { ProyectoInversionService } from '../../../service/proyecto-inversion.service';
import { ActividadService } from '../../../service/actividad.service';
import { ProyectoInversionModel } from '../../../models/proyecto-inversion.model';
import { ActividadModel } from '../../../models/actividad.model';
import { EstadoObjetivosEstrategicos } from '../../../shared/enums/estado-objetivos-estrategicos.enum';
import { AppDetallePrincipal } from "../../../layout/component/app.detalle-principal";
import { AppToolbarCrud } from "../../../layout/component/app.toolbar-crud";

@Component({
    selector: 'app-proyecto-nuevo',
    standalone: true,
    template: `<div class="card">
        <app-detalle-principal [items]="items" titulo="Nuevo Proyecto de Inversión"></app-detalle-principal>
        <form [formGroup]="proyectoForm" (ngSubmit)="onSubmit()">
            <app-toolbar-crud [linkRegreso]="'/proyecto-inversion/proyecto'" [grabando]="grabando" [initializeUserForm]="initializeUserForm.bind(this)"></app-toolbar-crud>
            <div class="p-fluid">
                <!-- CUP -->
                <div class="p-field mt-8 mb-6">
                    <p-floatLabel>
                        <input id="cup" type="text" pInputText formControlName="cup" class="w-1/2" style="text-transform:uppercase" />
                        <label for="cup">CUP</label>
                    </p-floatLabel>
                    @if (proyectoForm.get('cup')?.invalid && proyectoForm.get('cup')?.touched) {
                        @if (proyectoForm.get('cup')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El CUP es requerido." />
                        }
                        @if (proyectoForm.get('cup')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El CUP debe tener al menos 5 caracteres." />
                        }
                    }
                </div>

                <!-- Título -->
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <input id="titulo" type="text" pInputText formControlName="titulo" class="w-3/4" />
                        <label for="titulo">Título del Proyecto</label>
                    </p-floatLabel>
                    @if (proyectoForm.get('titulo')?.invalid && proyectoForm.get('titulo')?.touched) {
                        @if (proyectoForm.get('titulo')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El título es requerido." />
                        }
                        @if (proyectoForm.get('titulo')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El título debe tener al menos 10 caracteres." />
                        }
                        @if (proyectoForm.get('titulo')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El título no puede exceder los 200 caracteres." />
                        }
                    }
                </div>

                <!-- Descripción -->
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <textarea id="descripcion" pInputTextarea formControlName="descripcion" rows="5" class="w-full"></textarea>
                        <label for="descripcion">Descripción del Proyecto</label>
                    </p-floatLabel>
                    @if (proyectoForm.get('descripcion')?.invalid && proyectoForm.get('descripcion')?.touched) {
                        @if (proyectoForm.get('descripcion')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="La descripción es requerida." />
                        }
                        @if (proyectoForm.get('descripcion')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="La descripción debe tener al menos 20 caracteres." />
                        }
                        @if (proyectoForm.get('descripcion')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="La descripción no puede exceder los 1000 caracteres." />
                        }
                    }
                </div>

                <!-- Actividades -->
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <p-multiSelect id="actividades" formControlName="actividades" [options]="actividadesDisponibles" optionLabel="nombre" optionValue="id" class="w-3/4">
                        </p-multiSelect>
                        <label for="actividades">Actividades</label>
                    </p-floatLabel>
                    @if (proyectoForm.get('actividades')?.invalid && proyectoForm.get('actividades')?.touched) {
                        @if (proyectoForm.get('actividades')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="Debe seleccionar al menos una actividad." />
                        }
                    }
                </div>
            </div>
        </form>
    </div>
    `,
    imports: [ReactiveFormsModule, BreadcrumbModule, CommonModule, RouterModule, MultiSelectModule, ToolbarModule, ButtonModule, InputTextModule, FloatLabelModule, MessageModule, TextareaModule, AppDetallePrincipal, AppToolbarCrud],
    providers: [MessageService]
})
export class ProyectoNuevoComponent implements OnInit {
    proyectoForm!: FormGroup;
    items: MenuItem[] = [];
    grabando = false;
    actividadesDisponibles: ActividadModel[] = [];

    constructor(
        private fb: FormBuilder,
        private proyectoInversionService: ProyectoInversionService,
        private actividadService: ActividadService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.items = [
            { icon: 'pi pi-home', route: '/' },
            { label: 'Proyecto de Inversión' },
            { label: 'Proyectos', route: '/proyecto-inversion/proyecto' },
            { label: 'Nuevo', route: '/proyecto-inversion/proyecto/nuevo' }
        ];
        this.initializeUserForm();
        this.cargarActividadesDisponibles();
    }

    cargarActividadesDisponibles(): void {
        this.actividadService.getActividades().subscribe({
            next: (actividades: ActividadModel[]) => {
                this.actividadesDisponibles = actividades.sort((a, b) => a.nombre.localeCompare(b.nombre));
            },
            error: (error: any) => {
                console.error('Error al cargar actividades:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar las actividades disponibles' });
            }
        });
    }

    initializeUserForm() {
        this.proyectoForm = this.fb.group({
            cup: ['', [Validators.required, Validators.minLength(5)]],
            titulo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
            descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
            actividades: [[], [Validators.required]]
        });
    }

    onSubmit() {
        if (this.proyectoForm.invalid) {
            this.proyectoForm.markAllAsTouched();
            console.error('Formulario inválido', this.proyectoForm);
            return;
        }
        this.grabando = true;

        const proyecto: ProyectoInversionModel = {
            id: 0, // Se asignará en el backend
            cup: this.proyectoForm.get('cup')?.value,
            titulo: this.proyectoForm.get('titulo')?.value,
            descripcion: this.proyectoForm.get('descripcion')?.value,
            estado: EstadoObjetivosEstrategicos.PendienteRevision, // Estado por defecto
            fechaCreacion: new Date(),
            fechaActualizacion: new Date(),
            actividades: this.proyectoForm.get('actividades')?.value || [],
            anexos: []
        };

        this.proyectoInversionService.add(proyecto).subscribe({
            next: (proyectoCreado) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Proyecto de inversión creado correctamente'
                });
                this.initializeUserForm();
            },
            error: (error) => {
                console.error('Error al guardar el proyecto:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo guardar el proyecto de inversión.'
                });
                this.grabando = false;
            },
            complete: () => {
                this.grabando = false;
            }
        });
    }
}
