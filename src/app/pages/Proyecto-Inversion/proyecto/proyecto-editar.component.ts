import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProyectoInversionService } from '../../../service/proyecto-inversion.service';
import { ActividadService } from '../../../service/actividad.service';
import { ProyectoInversionModel } from '../../../models/proyecto-inversion.model';
import { ActividadModel } from '../../../models/actividad.model';
import { AnexoProyectoModel } from '../../../models/anexo-proyecto.model';
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

                    <!-- Anexos Existentes -->
                    @if (proyecto && proyecto.anexos && proyecto.anexos.length > 0) {
                        <div class="p-field mb-6">
                            <label class="font-medium text-gray-700 mb-2 block">Anexos Existentes</label>
                            <div class="border border-gray-300 rounded-lg p-4">
                                @for (anexo of proyecto.anexos; track anexo.id) {
                                    <div class="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded mb-2">
                                        <div class="flex items-center">
                                            <i class="pi pi-file mr-2 text-gray-600"></i>
                                            <div>
                                                <span class="text-sm font-medium">{{ anexo.nombre }}</span>
                                                @if (anexo.descripcion) {
                                                    <div class="text-xs text-gray-500">{{ anexo.descripcion }}</div>
                                                }
                                            </div>
                                        </div>
                                        <div class="flex gap-2">
                                            <button type="button"
                                                    pButton
                                                    icon="pi pi-download"
                                                    class="p-button-text p-button-sm"
                                                    (click)="descargarAnexo(anexo)"
                                                    pTooltip="Descargar anexo">
                                            </button>
                                            <button type="button"
                                                    pButton
                                                    icon="pi pi-times"
                                                    class="p-button-text p-button-sm p-button-danger"
                                                    (click)="eliminarAnexoExistente(anexo)"
                                                    pTooltip="Eliminar anexo">
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }

                    <!-- Anexos Nuevos -->
                    <div class="p-field mb-6">
                        <label class="font-medium text-gray-700 mb-2 block">Anexos Nuevos (Opcional)</label>
                        <div class="border border-gray-300 rounded-lg p-4">
                            <!-- Lista de anexos nuevos seleccionados -->
                            @if (anexosNuevos.length > 0) {
                                <div class="mb-4">
                                    <h4 class="text-sm font-semibold text-gray-600 mb-2">Archivos nuevos seleccionados:</h4>
                                    @for (anexo of anexosNuevos; track $index) {
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
                                                    (click)="eliminarAnexoNuevo($index)"
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

            <p-confirmDialog></p-confirmDialog>
        </div>`,
    imports: [BreadcrumbModule, RouterModule, CommonModule, ReactiveFormsModule, FormsModule, ToolbarModule, ButtonModule, FloatLabelModule, MessageModule, InputTextModule, TextareaModule, MultiSelectModule, FileUploadModule, DialogModule, TooltipModule, ConfirmDialogModule, AppDetallePrincipal, AppToolbarCrud],
    providers: [MessageService, ConfirmationService]
})
export class ProyectoEditarComponent implements OnInit {
    items: MenuItem[] = [];
    proyectoForm!: FormGroup;
    grabando = false;
    nombre = '';
    proyecto!: ProyectoInversionModel;
    id: number = 0;

    // Propiedades para actividades
    actividadesDisponibles: ActividadModel[] = [];

    // Propiedades para anexos
    anexosNuevos: any[] = [];
    mostrarDialogo = false;
    intentoEnvio = false;
    anexoTemporal: any = {
        nombre: '',
        descripcion: '',
        file: null
    };

    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private proyectoInversionService: ProyectoInversionService,
        private actividadService: ActividadService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
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
        this.cargarActividadesDisponibles();
        this.loadProyecto();
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

    loadProyecto() {
        this.proyectoInversionService.getById(this.id).subscribe({
            next: (data) => {
                // Extraer IDs de actividades para el formulario
                const actividadIds = data.actividades ? data.actividades.map(actividad => actividad.id) : [];

                this.proyectoForm.patchValue({
                    id: data.id,
                    cup: data.cup,
                    titulo: data.titulo,
                    descripcion: data.descripcion,
                    actividades: actividadIds
                });
                this.proyecto = data;
                this.nombre = `Editar Proyecto: ${data.titulo}`;

                // Mostrar mensaje de advertencia si el proyecto fue rechazado
                if (data.estado === EstadoObjetivosEstrategicos.Rechazado) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: 'El proyecto fue rechazado y se colocará en estado pendiente una vez guarde la información.'
                    });
                }
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
            actividades: [[], [Validators.required]]
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
            actividades: this.proyectoForm.get('actividades')?.value || [],
            fechaActualizacion: new Date()
        };

        this.proyectoInversionService.update(this.id, proyectoData).subscribe({
            next: (respuesta) => {
                const { data, error, mensaje } = respuesta;
                // Si hay anexos nuevos, subirlos después de actualizar el proyecto
                if (this.anexosNuevos.length > 0) {
                    this.subirAnexosNuevos(this.id);
                } else {
                    if(error) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: mensaje || 'No se pudo actualizar el proyecto.'
                        });
                        this.grabando = false;
                        return;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: mensaje || 'Proyecto actualizado correctamente'
                    });
                    this.proyecto = data;
                    this.grabando = false;
                }
            },
            error: (error) => {
                console.error('Error al actualizar el proyecto:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo actualizar el proyecto.'
                });
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
            this.anexosNuevos.push({
                nombre: this.anexoTemporal.nombre,
                descripcion: this.anexoTemporal.descripcion,
                file: this.anexoTemporal.file
            });
            this.cerrarDialogoAnexo();
        }
    }

    eliminarAnexoNuevo(index: number): void {
        this.anexosNuevos.splice(index, 1);
    }

    eliminarAnexoExistente(anexo: AnexoProyectoModel): void {
        this.confirmationService.confirm({
            message: `¿Está seguro de que desea eliminar el anexo "${anexo.nombre}"?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, Eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.proyectoInversionService.eliminarAnexo(anexo.id).subscribe({
                    next: (respuesta) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: `Anexo "${anexo.nombre}" eliminado correctamente`
                        });
                        this.loadProyecto(); // Recargar para mostrar los cambios
                    },
                    error: (error) => {
                        console.error('Error al eliminar anexo:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: `No se pudo eliminar el anexo "${anexo.nombre}"`
                        });
                    }
                });
            }
        });
    }

    descargarAnexo(anexo: AnexoProyectoModel): void {
        this.proyectoInversionService.descargarAnexo(anexo.id).subscribe({
            next: (blob: Blob) => {
                // Crear un enlace temporal para descargar el archivo
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = anexo.nombre || 'anexo';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Anexo "${anexo.nombre}" descargado correctamente`
                });
            },
            error: (error) => {
                console.error('Error al descargar anexo:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se pudo descargar el anexo "${anexo.nombre}"`
                });
            }
        });
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    subirAnexosNuevos(proyectoId: number): void {
        let anexosSubidos = 0;
        const totalAnexos = this.anexosNuevos.length;

        this.anexosNuevos.forEach((anexo, index) => {
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
                            detail: `Proyecto actualizado correctamente${totalAnexos > 0 ? ` con ${totalAnexos} anexo(s) nuevos` : ''}`
                        });
                        this.anexosNuevos = [];
                        this.loadProyecto(); // Recargar para mostrar los nuevos anexos
                        this.grabando = false;
                    }
                },
                error: (error) => {
                    console.error(`Error al subir anexo ${anexo.nombre}:`, error);
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: `El proyecto se actualizó correctamente, pero hubo un error al subir el anexo: ${anexo.nombre}`
                    });
                    anexosSubidos++;
                    if (anexosSubidos === totalAnexos) {
                        this.anexosNuevos = [];
                        this.loadProyecto();
                        this.grabando = false;
                    }
                }
            });
        });
    }
}
