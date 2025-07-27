import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { AppCabeceraPrincipal } from '../../../layout/component/app.cabecera-principal';
import { ProyectoInversionService } from '../../../service/proyecto-inversion.service';
import { UsuarioService } from '../../../service/usuario.service';
import { ProyectoInversionModel } from '../../../models/proyecto-inversion.model';
import { AnexoProyectoModel } from '../../../models/anexo-proyecto.model';
import { UsuarioModel } from '../../../models/usuario.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppDetallePrincipal } from "../../../layout/component/app.detalle-principal";
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-proyecto-anexos',
    standalone: true,
    template: `
        <div class="card">
            <app-detalle-principal [items]="items" [titulo]="'Anexos del Proyecto: ' + (proyecto?.titulo || '')"></app-detalle-principal>
            <p-toolbar>
                <ng-template #start>
                     <button pButton
                        label="Regresar al Listado"
                        icon="pi pi-arrow-left"
                        class="p-button-outlined"
                        (click)="regresarAlListado()">
                </button>
                </ng-template>
            </p-toolbar>
            <!-- Información del proyecto -->
            @if (proyecto) {
                <div class="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 mt-5 mb-5">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-lg font-semibold text-blue-900">{{ proyecto.titulo }}</h3>
                            <p class="text-blue-700"><strong>CUP:</strong> {{ proyecto.cup }}</p>
                            <p class="text-blue-600 text-sm mt-1">{{ proyecto.descripcion }}</p>
                        </div>
                        @if (esExterno()) {
                            <button pButton
                                    label="Subir Anexo"
                                    icon="pi pi-upload"
                                    class="p-button-success"
                                    (click)="mostrarDialogoSubida()">
                            </button>
                        }
                    </div>
                </div>
            }

            <!-- Tabla de anexos -->
            <p-table
                [value]="anexos"
                [loading]="loading"
                [paginator]="true"
                [rows]="10"
                [rowsPerPageOptions]="[10, 20, 50]"
                [responsiveLayout]="'scroll'">

                <ng-template #header>
                    <tr>
                        <th style="width: 10%">Acciones</th>
                        <th style="width: 30%">Nombre</th>
                        <th style="width: 50%">Descripción</th>
                        <th style="width: 10%">Archivo</th>
                    </tr>
                </ng-template>

                <ng-template #body let-anexo>
                    <tr>
                        <td>
                            <div class="flex gap-2">
                                <button pButton
                                        icon="pi pi-download"
                                        size="small"
                                        class="p-button-rounded p-button-info p-button-text"
                                        (click)="descargarAnexo(anexo)"
                                        pTooltip="Descargar"
                                        tooltipPosition="top">
                                </button>
                                @if (esExterno()) {
                                    <button pButton
                                            icon="pi pi-trash"
                                            size="small"
                                            class="p-button-rounded p-button-danger p-button-text"
                                            (click)="eliminarAnexo(anexo)"
                                            pTooltip="Eliminar"
                                            tooltipPosition="top">
                                    </button>
                                }
                            </div>
                        </td>
                        <td>
                            <span class="font-medium">{{ anexo.nombre }}</span>
                        </td>
                        <td>
                            <span class="text-sm text-gray-600">{{ anexo.descripcion || 'Sin descripción' }}</span>
                        </td>
                        <td>
                            <i class="pi pi-file text-blue-500"></i>
                        </td>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td colspan="4" class="text-center py-4">
                            <div class="text-gray-500">
                                <i class="pi pi-inbox text-4xl mb-2 block"></i>
                                <p>No hay anexos cargados para este proyecto</p>
                                @if (esExterno()) {
                                    <button pButton
                                            label="Subir Primer Anexo"
                                            icon="pi pi-upload"
                                            class="p-button-outlined mt-2"
                                            (click)="mostrarDialogoSubida()">
                                    </button>
                                }
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Dialog para subir anexo -->
        <p-dialog
            header="Subir Anexo"
            [(visible)]="mostrarDialog"
            [modal]="true"
            [style]="{ width: '50vw' }"
            [draggable]="false"
            [resizable]="false">

            <form [formGroup]="formAnexo" (ngSubmit)="subirAnexo()">
                <div class="p-fluid">
                    <!-- Nombre del Anexo -->
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <input id="nombre"
                                   type="text"
                                   pInputText
                                   formControlName="nombre"
                                   class="w-full"
                                   [class.ng-invalid.ng-dirty]="formAnexo.get('nombre')?.invalid && formAnexo.get('nombre')?.touched" />
                            <label for="nombre">Nombre del Anexo *</label>
                        </p-floatLabel>
                        @if (formAnexo.get('nombre')?.invalid && formAnexo.get('nombre')?.touched) {
                            <small class="p-error">El nombre es requerido</small>
                        }
                    </div>

                    <!-- Descripción -->
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <textarea id="descripcion"
                                      pInputTextarea
                                      formControlName="descripcion"
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
                        @if (!archivoSeleccionado && intentoEnvio) {
                            <small class="p-error">Debe seleccionar un archivo</small>
                        }
                        @if (archivoSeleccionado) {
                            <div class="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                                <i class="pi pi-check-circle text-green-600 mr-2"></i>
                                <span class="text-green-700">{{ archivoSeleccionado.name }}</span>
                                <span class="text-green-600 text-sm ml-2">({{ formatFileSize(archivoSeleccionado.size) }})</span>
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
                            (click)="cerrarDialog()">
                    </button>
                    <button pButton
                            label="Subir Anexo"
                            icon="pi pi-upload"
                            class="p-button-success"
                            type="submit"
                            [loading]="subiendoArchivo">
                    </button>
                </div>
            </form>
        </p-dialog>

        <p-toast position="top-right"></p-toast>
        <p-confirmDialog></p-confirmDialog>
    `,
    imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    FloatLabelModule,
    TextareaModule,
    FileUploadModule,
    ReactiveFormsModule,
    AppDetallePrincipal,
    ToolbarModule
],
    providers: [MessageService, ConfirmationService]
})
export class ProyectoAnexosComponent implements OnInit {
    items: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Proyecto de Inversión' },
        { label: 'Proyectos', route: '/proyecto-inversion/proyecto' },
        { label: 'Anexos' }
    ];

    proyecto: ProyectoInversionModel | null = null;
    anexos: AnexoProyectoModel[] = [];
    loading: boolean = true;
    usuarioActual: UsuarioModel | null = null;

    // Dialog
    mostrarDialog: boolean = false;
    formAnexo: FormGroup;
    archivoSeleccionado: File | null = null;
    intentoEnvio: boolean = false;
    subiendoArchivo: boolean = false;

    private proyectoId: number = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private proyectoInversionService: ProyectoInversionService,
        private usuarioService: UsuarioService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.formAnexo = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: ['']
        });
    }

    ngOnInit(): void {
        this.cargarUsuarioActual();
        this.route.params.subscribe(params => {
            this.proyectoId = +params['id'];
            if (this.proyectoId) {
                this.cargarProyecto();
            }
        });
    }

    cargarUsuarioActual(): void {
        this.usuarioService.getMe().subscribe({
            next: (usuario) => {
                this.usuarioActual = usuario;
            },
            error: (error) => {
                console.error('Error al cargar usuario:', error);
            }
        });
    }

    // Métodos de verificación de roles
    esExterno(): boolean {
        return this.usuarioActual?.roles?.includes('Externo') || false;
    }

    esRevisor(): boolean {
        return this.usuarioActual?.roles?.includes('Revisor') || false;
    }

    esAutoridadValidante(): boolean {
        return this.usuarioActual?.roles?.includes('Autoridad') || false;
    }

    cargarProyecto(): void {
        this.loading = true;

        this.proyectoInversionService.getById(this.proyectoId).subscribe({
            next: (proyecto) => {
                this.proyecto = proyecto;
                this.anexos = proyecto.anexos || [];
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al cargar proyecto:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar la información del proyecto'
                });
                this.loading = false;
                this.router.navigate(['/proyecto-inversion/proyecto']);
            }
        });
    }

    regresarAlListado(): void {
        this.router.navigate(['/proyecto-inversion/proyecto']);
    }

    mostrarDialogoSubida(): void {
        if (!this.esExterno()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Acceso Denegado',
                detail: 'Solo los usuarios externos pueden subir anexos'
            });
            return;
        }
        
        this.mostrarDialog = true;
        this.formAnexo.reset();
        this.archivoSeleccionado = null;
        this.intentoEnvio = false;
    }

    cerrarDialog(): void {
        this.mostrarDialog = false;
        this.formAnexo.reset();
        this.archivoSeleccionado = null;
        this.intentoEnvio = false;
    }

    onFileSelect(event: any): void {
        const file = event.files[0];
        if (file) {
            this.archivoSeleccionado = file;
        }
    }

    subirAnexo(): void {
        if (!this.esExterno()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Acceso Denegado',
                detail: 'Solo los usuarios externos pueden subir anexos'
            });
            return;
        }

        this.intentoEnvio = true;

        if (this.formAnexo.valid && this.archivoSeleccionado) {
            this.subiendoArchivo = true;

            const { nombre, descripcion } = this.formAnexo.value;

            this.proyectoInversionService.uploadAnexo(
                this.proyectoId,
                this.archivoSeleccionado,
                nombre,
                descripcion || ''
            ).subscribe({
                next: (anexo) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Anexo subido correctamente'
                    });
                    this.cerrarDialog();
                    this.cargarProyecto(); // Recargar para mostrar el nuevo anexo
                    this.subiendoArchivo = false;
                },
                error: (error) => {
                    console.error('Error al subir anexo:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo subir el anexo'
                    });
                    this.subiendoArchivo = false;
                }
            });
        }
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

    eliminarAnexo(anexo: AnexoProyectoModel): void {
        if (!this.esExterno()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Acceso Denegado',
                detail: 'Solo los usuarios externos pueden eliminar anexos'
            });
            return;
        }

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
                        this.cargarProyecto(); // Recargar para mostrar los cambios
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

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
