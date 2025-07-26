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
import { ToolbarModule } from 'primeng/toolbar';
import { TextareaModule } from 'primeng/textarea';
import { ProyectoInversionService } from '../../../service/proyecto-inversion.service';
import { ProyectoInversionModel } from '../../../models/proyecto-inversion.model';
import { EstadoObjetivosEstrategicos } from '../../../shared/enums/estado-objetivos-estrategicos.enum';
import { AppDetallePrincipal } from "../../../layout/component/app.detalle-principal";
import { AppToolbarCrud } from "../../../layout/component/app.toolbar-crud";

@Component({
    selector: 'app-proyecto-editar',
    standalone: true,
    template: `<div class="card">
            <app-detalle-principal [items]="items" [titulo]="nombre"></app-detalle-principal>
            <form [formGroup]="proyectoForm" (ngSubmit)="onSubmit()">
                <app-toolbar-crud [linkRegreso]="'/proyecto-inversion/proyecto'" [grabando]="grabando" [initializeUserForm]="initializeUserForm.bind(this)" [mostrarReset]="false"></app-toolbar-crud>
                <div class="p-fluid">
                    <!-- ID -->
                    <div class="p-field mt-8 mb-6">
                        <p-floatLabel>
                            <input id="id" type="text" pInputText formControlName="id" class="w-1/5" readonly />
                            <label for="id">ID</label>
                        </p-floatLabel>
                    </div>

                    <!-- CUP -->
                    <div class="p-field mb-6">
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

                    <!-- Estado -->
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <p-select id="estado" formControlName="estado" [options]="estadosDisponibles" optionLabel="label" optionValue="value" class="w-1/3">
                            </p-select>
                            <label for="estado">Estado</label>
                        </p-floatLabel>
                        @if (proyectoForm.get('estado')?.invalid && proyectoForm.get('estado')?.touched) {
                            @if (proyectoForm.get('estado')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small" text="El estado es requerido." />
                            }
                        }
                    </div>

                    <!-- Información de fechas -->
                    @if (proyecto) {
                        <div class="p-field mb-6">
                            <div class="grid">
                                <div class="col-12 md:col-6">
                                    <label class="font-medium text-sm text-gray-600">Fecha de Creación:</label>
                                    <p class="mt-1">{{ formatDate(proyecto.fechaCreacion) }}</p>
                                </div>
                                <div class="col-12 md:col-6">
                                    <label class="font-medium text-sm text-gray-600">Última Actualización:</label>
                                    <p class="mt-1">{{ formatDate(proyecto.fechaActualizacion) }}</p>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </form>
        </div>`,
    imports: [BreadcrumbModule, RouterModule, CommonModule, ReactiveFormsModule, ToolbarModule, ButtonModule, FloatLabelModule, MessageModule, InputTextModule, TextareaModule, SelectModule, AppDetallePrincipal, AppToolbarCrud],
    providers: [MessageService]
})
export class ProyectoEditarComponent implements OnInit {
    items: MenuItem[] = [];
    proyectoForm!: FormGroup;
    grabando = false;
    nombre = '';
    proyecto!: ProyectoInversionModel;
    id: number = 0;

    estadosDisponibles = [
        { label: 'Activo', value: EstadoObjetivosEstrategicos.Activo },
        { label: 'Pendiente de Revisión', value: EstadoObjetivosEstrategicos.PendienteRevision },
        { label: 'Pendiente de Autoridad', value: EstadoObjetivosEstrategicos.PendienteAutoridad },
        { label: 'Inactivo', value: EstadoObjetivosEstrategicos.Inactivo }
    ];

    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private proyectoInversionService: ProyectoInversionService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.items = [
            { icon: 'pi pi-home', route: '/' },
            { label: 'Proyecto de Inversión' },
            { label: 'Proyectos', route: '/proyecto-inversion/proyecto' },
            { label: 'Editar', route: '/proyecto-inversion/proyecto/editar' }
        ];
        this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.initializeUserForm();
        this.loadProyecto();
    }

    loadProyecto() {
        this.proyectoInversionService.getById(this.id).subscribe({
            next: (data) => {
                this.proyectoForm.patchValue({
                    id: data.id,
                    cup: data.cup,
                    titulo: data.titulo,
                    descripcion: data.descripcion,
                    estado: data.estado
                });
                this.proyecto = data;
                this.nombre = `Editar Proyecto: ${data.titulo}`;
            },
            error: (error) => {
                console.error('Error al obtener el proyecto:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el proyecto.' });
            }
        });
    }

    initializeUserForm() {
        this.proyectoForm = this.fb.group({
            id: [{ value: '', disabled: true }],
            cup: ['', [Validators.required, Validators.minLength(5)]],
            titulo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
            descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
            estado: ['', Validators.required]
        });
        this.proyectoForm.markAsUntouched();
    }

    onSubmit() {
        if (this.proyectoForm.invalid) {
            this.proyectoForm.markAllAsTouched();
            return;
        }

        this.grabando = true;
        const proyectoData: ProyectoInversionModel = {
            ...this.proyecto,
            ...this.proyectoForm.value,
            fechaActualizacion: new Date()
        };
        this.proyectoInversionService.update(this.id, proyectoData).subscribe({
            next: (proyectoActualizado) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Proyecto actualizado correctamente'
                });
                // Actualizar el proyecto local
                this.proyecto = proyectoActualizado;
            },
            error: (error) => {
                console.error('Error al actualizar el proyecto:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo actualizar el proyecto.'
                });
                this.grabando = false;
            },
            complete: () => {
                this.grabando = false;
            }
        });
    }

    formatDate(date: Date): string {
        if (!date) return 'No disponible';
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
