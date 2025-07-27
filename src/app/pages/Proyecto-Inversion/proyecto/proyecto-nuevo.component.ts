import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
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
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ProyectoInversionService } from '../../../service/proyecto-inversion.service';
import { ActividadService } from '../../../service/actividad.service';
import { ProyectoInversionModel } from '../../../models/proyecto-inversion.model';
import { ActividadModel } from '../../../models/actividad.model';
import { AnexoProyectoModel } from '../../../models/anexo-proyecto.model';
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

                <!-- Anexos -->
                <div class="p-field mb-6">
                    <label class="font-medium text-gray-700 mb-2 block">Anexos (Opcional)</label>
                    <div class="border border-gray-300 rounded-lg p-4">
                        <!-- Lista de anexos seleccionados -->
                        @if (anexosSeleccionados.length > 0) {
                            <div class="mb-4">
                                <h4 class="text-sm font-semibold text-gray-600 mb-2">Archivos seleccionados:</h4>
                                @for (anexo of anexosSeleccionados; track $index) {
                                    <div class="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded mb-2">
                                        <div class="flex items-center">
                                            <i class="pi pi-file mr-2 text-blue-600"></i>
                                            <div>
                                                <span class="text-sm font-medium">{{ anexo.nombre }}</span>
                                                @if (anexo.descripcion) {
                                                    <div class="text-xs text-gray-500">{{ anexo.descripcion }}</div>
                                                }
                                                <div class="text-xs text-gray-400">{{ formatFileSize(anexo.file.size) }}</div>
                                            </div>
                                        </div>
                                        <button type="button"
                                                pButton
                                                icon="pi pi-times"
                                                class="p-button-text p-button-sm p-button-danger"
                                                (click)="eliminarAnexo($index)"
                                                pTooltip="Eliminar anexo">
                                        </button>
                                    </div>
                                }
                            </div>
                        }

                        <!-- Botón para agregar anexos -->
                        <button type="button"
                                pButton
                                label="Agregar Anexo"
                                icon="pi pi-plus"
                                class="p-button-outlined"
                                (click)="mostrarDialogoAnexo()">
                        </button>
                    </div>
                </div>
            </div>
        </form>

        <!-- Dialog para agregar anexo -->
        <p-dialog
            header="Agregar Anexo"
            [(visible)]="mostrarDialogo"
            [modal]="true"
            [style]="{ width: '50vw' }"
            [draggable]="false"
            [resizable]="false">

            <form (ngSubmit)="agregarAnexo()">
                <div class="p-fluid">
                    <!-- Nombre del Anexo -->
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <input id="nombre"
                                   type="text"
                                   pInputText
                                   [(ngModel)]="anexoTemporal.nombre"
                                   name="nombre"
                                   class="w-full"
                                   [class.ng-invalid.ng-dirty]="!anexoTemporal.nombre && intentoEnvio" />
                            <label for="nombre">Nombre del Anexo *</label>
                        </p-floatLabel>
                        @if (!anexoTemporal.nombre && intentoEnvio) {
                            <small class="p-error">El nombre es requerido</small>
                        }
                    </div>

                    <!-- Descripción -->
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <textarea id="descripcion"
                                      pInputTextarea
                                      [(ngModel)]="anexoTemporal.descripcion"
                                      name="descripcion"
                                      rows="3"
                                      class="w-full">
                            </textarea>
                            <label for="descripcion">Descripción</label>
                        </p-floatLabel>
                    </div>

                    <!-- Archivo -->
                    <div class="p-field mb-6">
                        <label class="font-medium text-gray-700 mb-2 block">Archivo *</label>
                        <p-fileUpload
                            #fileUpload
                            mode="basic"
                            [auto]="false"
                            chooseLabel="Seleccionar Archivo"
                            [maxFileSize]="10000000"
                            [customUpload]="true"
                            (onSelect)="onFileSelect($event)">
                        </p-fileUpload>
                        @if (!anexoTemporal.file && intentoEnvio) {
                            <small class="p-error">Debe seleccionar un archivo</small>
                        }
                        @if (anexoTemporal.file) {
                            <div class="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                                <i class="pi pi-check-circle text-green-600 mr-2"></i>
                                <span class="text-green-700">{{ anexoTemporal.file.name }}</span>
                                <span class="text-green-600 text-sm ml-2">({{ formatFileSize(anexoTemporal.file.size) }})</span>
                            </div>
                        }
                    </div>
                </div>

                <div class="flex justify-end gap-2 mt-4">
                    <button pButton
                            label="Cancelar"
                            icon="pi pi-times"
                            class="p-button-text"
                            type="button"
                            (click)="cerrarDialogoAnexo()">
                    </button>
                    <button pButton
                            label="Agregar"
                            icon="pi pi-plus"
                            class="p-button-success"
                            type="submit"
                            [disabled]="!anexoTemporal.nombre || !anexoTemporal.file">
                    </button>
                </div>
            </form>
        </p-dialog>
    </div>
    `,
    imports: [ReactiveFormsModule, FormsModule, BreadcrumbModule, CommonModule, RouterModule, MultiSelectModule, ToolbarModule, ButtonModule, InputTextModule, FloatLabelModule, MessageModule, TextareaModule, FileUploadModule, DialogModule, TooltipModule, AppDetallePrincipal, AppToolbarCrud],
    providers: [MessageService]
})
export class ProyectoNuevoComponent implements OnInit {
    proyectoForm!: FormGroup;
    items: MenuItem[] = [];
    grabando = false;
    actividadesDisponibles: ActividadModel[] = [];

    // Propiedades para anexos
    anexosSeleccionados: any[] = [];
    mostrarDialogo = false;
    intentoEnvio = false;
    anexoTemporal: any = {
        nombre: '',
        descripcion: '',
        file: null
    };

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
            next: (respuesta) => {
                const {data} = respuesta;
                console.log(data);
                if (this.anexosSeleccionados.length > 0) {
                    const proyectoId = typeof data === 'object' ? data.id : data;
                    this.subirAnexos(proyectoId);
                } else {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Proyecto de inversión creado correctamente'
                    });
                    this.initializeUserForm();
                    this.anexosSeleccionados = [];
                    this.grabando = false;
                }
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

    // Métodos para manejo de anexos
    mostrarDialogoAnexo(): void {
        this.mostrarDialogo = true;
        this.intentoEnvio = false;
        this.anexoTemporal = {
            nombre: '',
            descripcion: '',
            file: null
        };
    }

    cerrarDialogoAnexo(): void {
        this.mostrarDialogo = false;
        this.intentoEnvio = false;
        this.anexoTemporal = {
            nombre: '',
            descripcion: '',
            file: null
        };
    }

    onFileSelect(event: any): void {
        const file = event.files[0];
        if (file) {
            this.anexoTemporal.file = file;
        }
    }

    agregarAnexo(): void {
        this.intentoEnvio = true;

        if (this.anexoTemporal.nombre && this.anexoTemporal.file) {
            this.anexosSeleccionados.push({
                nombre: this.anexoTemporal.nombre,
                descripcion: this.anexoTemporal.descripcion,
                file: this.anexoTemporal.file
            });
            this.cerrarDialogoAnexo();
        }
    }

    eliminarAnexo(index: number): void {
        this.anexosSeleccionados.splice(index, 1);
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    subirAnexos(proyectoId: number): void {
        let anexosSubidos = 0;
        const totalAnexos = this.anexosSeleccionados.length;

        this.anexosSeleccionados.forEach((anexo, index) => {
            this.proyectoInversionService.uploadAnexo(
                proyectoId,
                anexo.file,
                anexo.nombre,
                anexo.descripcion || ''
            ).subscribe({
                next: (response) => {
                    anexosSubidos++;
                    if (anexosSubidos === totalAnexos) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: `Proyecto de inversión creado correctamente${totalAnexos > 0 ? ` con ${totalAnexos} anexo(s)` : ''}`
                        });
                        this.initializeUserForm();
                        this.anexosSeleccionados = [];
                        this.grabando = false;
                    }
                },
                error: (error) => {
                    console.error(`Error al subir anexo ${anexo.nombre}:`, error);
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: `El proyecto se creó correctamente, pero hubo un error al subir el anexo: ${anexo.nombre}`
                    });
                    anexosSubidos++;
                    if (anexosSubidos === totalAnexos) {
                        this.initializeUserForm();
                        this.anexosSeleccionados = [];
                        this.grabando = false;
                    }
                }
            });
        });
    }
}
