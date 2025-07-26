import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { RolModel } from '../../../models/rol.model';
import { InstitucionModel } from '../../../models/institucion.model';
import { EstadoConfiguracionInstitucional } from '../../../shared/enums/estado-configuracion-institucional.enum';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { UsuarioService } from '../../../service/usuario.service';
import { UsuarioModel } from '../../../models/usuario.model';
import { RolService } from '../../../service/rol.service';
import { InstitucionService } from '../../../service/institucion.service';
import { ToolbarModule } from 'primeng/toolbar';

// Interfaz extendida para mostrar código y nombre
interface InstitucionExtendida extends InstitucionModel {
    displayName: string;
}
@Component({
    selector: 'app-usuarios-editar',
    standalone: true,
    template: `
        <div class="card">
            <div class="font-semibold text-xl">Editar Usuario {{ id }}</div>
            <p-breadcrumb class="max-w-full" [model]="items">
                <ng-template #item let-item>
                    <ng-container *ngIf="item.route; else elseBlock">
                        <a [routerLink]="item.route" class="p-breadcrumb-item-link">
                            <span [ngClass]="[item.icon ? item.icon : '', 'text-color']"></span>
                            <span class="text-primary font-semibold">{{ item.label }}</span>
                        </a>
                    </ng-container>
                    <ng-template #elseBlock>
                        <a [href]="item.url">
                            <span class="text-color">{{ item.label }}</span>
                        </a>
                    </ng-template>
                </ng-template>
            </p-breadcrumb>
            <form [formGroup]="usuarioForm" (ngSubmit)="onSubmit()" class="p-fluid mt-4">
                <p-toolbar>
                    <ng-template #start>
                        <button pButton type="button" icon="pi pi-arrow-left" label="Regresar" class="p-button-secondary mr-2" [routerLink]="['/gestion-usuarios/usuarios']" [disabled]="grabando"></button>
                        <button pButton type="submit" icon="pi pi-save" label="Actualizar" [disabled]="grabando"></button>
                    </ng-template>
                </p-toolbar>
                <div class="p-field mt-8 mb-6">
                    <p-floatLabel>
                        <input id="id" type="text" pInputText formControlName="id" class="w-2/5" />
                        <label for="id">Id</label>
                    </p-floatLabel>
                </div>
                <div class="flex gap-2 mb-6">
                    <div class="flex-1">
                        <p-floatLabel>
                            <input id="primerNombre" type="text" pInputText formControlName="primerNombre" class="w-full" />
                            <label for="primerNombre">Primer Nombre</label>
                        </p-floatLabel>
                        @if (usuarioForm.get('primerNombre')?.invalid && usuarioForm.get('primerNombre')?.touched) {
                            @if (usuarioForm.get('primerNombre')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small">Primer Nombre es requerido</p-message>
                            }
                            @if (usuarioForm.get('primerNombre')?.errors?.['minlength']) {
                                <p-message severity="error" variant="simple" size="small">Primer Nombre debe tener al menos 2 caracteres</p-message>
                            }
                        }
                    </div>
                    <div class="flex-1">
                        <p-floatLabel>
                            <input id="segundoNombre" type="text" pInputText formControlName="segundoNombre" class="w-full" />
                            <label for="segundoNombre">Segundo Nombre</label>
                            @if (usuarioForm.get('segundoNombre')?.invalid && usuarioForm.get('segundoNombre')?.touched) {
                                @if (usuarioForm.get('segundoNombre')?.errors?.['required']) {
                                    <p-message severity="error" variant="simple" size="small">Segundo Nombre es requerido</p-message>
                                }
                                @if (usuarioForm.get('segundoNombre')?.errors?.['minlength']) {
                                    <p-message severity="error" variant="simple" size="small">Segundo Nombre debe tener al menos 2 caracteres</p-message>
                                }
                            }
                        </p-floatLabel>
                    </div>
                </div>
                <div class="p-field mb-6 mt-2">
                    <p-floatLabel>
                        <input id="nombre" type="text" pInputText formControlName="nombre" class="xl:w-1/2 md:w-full xs:w-full" />
                        <label for="nombre">Nombre</label>
                    </p-floatLabel>
                </div>
                <div class="p-field mb-6 mt-5 ">
                    <p-floatLabel>
                        <input id="correo" type="email" pInputText formControlName="correo" class="w-1/3" />
                        <label for="correo">Correo</label>
                        @if (usuarioForm.get('correo')?.invalid && usuarioForm.get('correo')?.touched) {
                            @if (usuarioForm.get('correo')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small">Correo es requerido</p-message>
                            }
                            @if (usuarioForm.get('correo')?.errors?.['email']) {
                                <p-message severity="error" variant="simple" size="small">Correo debe ser un email válido</p-message>
                            }
                        }
                    </p-floatLabel>
                </div>
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <input id="telefono" type="text" pInputText formControlName="telefono" />
                        <label for="telefono">Teléfono</label>
                    </p-floatLabel>
                    @if (usuarioForm.get('telefono')?.invalid && usuarioForm.get('telefono')?.touched) {
                        @if (usuarioForm.get('telefono')?.errors?.['pattern']) {
                            <p-message severity="error" variant="simple" size="small">Teléfono debe contener solo números</p-message>
                        }
                    }
                </div>
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <input id="avatarUrl" type="text" pInputText formControlName="avatarUrl" />
                        <label for="avatarUrl">Avatar URL</label>
                    </p-floatLabel>
                    @if (usuarioForm.get('avatarUrl')?.invalid && usuarioForm.get('avatarUrl')?.touched) {
                        @if (usuarioForm.get('avatarUrl')?.errors?.['pattern']) {
                            <p-message severity="error" variant="simple" size="small">Avatar URL debe ser una URL válida</p-message>
                        }
                    }
                </div>
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <input id="userName" type="text" pInputText formControlName="userName" />
                        <label for="userName">Usuario</label>
                    </p-floatLabel>
                    @if (usuarioForm.get('userName')?.invalid && usuarioForm.get('userName')?.touched) {
                        @if (usuarioForm.get('userName')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small">Usuario es requerido</p-message>
                        }
                        @if (usuarioForm.get('userName')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small">Usuario debe tener al menos 3 caracteres</p-message>
                        }
                    }
                </div>
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <p-select id="tipoUsuario" formControlName="tipoUsuario" [options]="tipoUsuarios" optionLabel="label" optionValue="value" class="w-1/5"></p-select>
                        <label for="tipoUsuario">Tipo Usuario</label>
                    </p-floatLabel>
                    @if (usuarioForm.get('tipoUsuario')?.invalid && usuarioForm.get('tipoUsuario')?.touched) {
                        @if (usuarioForm.get('tipoUsuario')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small">Tipo Usuario es requerido</p-message>
                        }
                    }
                </div>
                @if (usuarioForm.get('tipoUsuario')?.value === 'Externo') {
                    <div class="p-field mb-6">
                        <p-floatLabel>
                            <p-select id="institucion" formControlName="idEntidadEstado" [options]="instituciones" optionLabel="displayName" optionValue="id" class="w-1/2" [showClear]="true" [filter]="true"></p-select>
                            <label for="institucion">Institución</label>
                        </p-floatLabel>
                        @if (usuarioForm.get('idEntidadEstado')?.invalid && usuarioForm.get('idEntidadEstado')?.touched) {
                            @if (usuarioForm.get('idEntidadEstado')?.errors?.['required']) {
                                <p-message severity="error" variant="simple" size="small">Institución es requerida para usuarios externos</p-message>
                            }
                        }
                    </div>
                }
                <div class="p-field mb-8">
                    <p-floatLabel>
                        <p-select id="roles" formControlName="roles" [options]="roles" optionLabel="nombre" optionValue="nombre" class="w-1/5" [showClear]="true" [disabled]="usuarioForm.get('tipoUsuario')?.value === 'Externo'"></p-select>
                        <label for="roles">Rol</label>
                    </p-floatLabel>
                    @if (usuarioForm.get('tipoUsuario')?.value === 'Externo') {
                        <p-message severity="info" variant="simple" size="small">Los usuarios externos tienen automáticamente el rol "Externo"</p-message>
                    }
                    @if (usuarioForm.get('roles')?.invalid && usuarioForm.get('roles')?.touched) {
                        @if (usuarioForm.get('roles')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small">Rol es requerido</p-message>
                        }
                        @if (usuarioForm.get('roles')?.errors?.['pattern']) {
                            <p-message severity="error" variant="simple" size="small">Rol debe contener solo letras, números y comas</p-message>
                        }
                    }
                </div>
            </form>
        </div>
        <p-toast position="top-right"></p-toast>
    `,
    imports: [BreadcrumbModule, RouterModule, CommonModule, ReactiveFormsModule, ButtonModule, FloatLabelModule, MessageModule, SelectModule, ToastModule, InputTextModule, ToolbarModule],
    providers: [MessageService]
})
export class UsuariosEditarComponent implements OnInit {
    id: string = '';
    usuarioForm!: FormGroup;
    items: MenuItem[] | undefined;
    grabando: boolean = false;
    tipoUsuarios = [
        { label: 'Interno', value: 'Interno' },
        { label: 'Externo', value: 'Externo' }
    ];
    roles: RolModel[] = [];
    instituciones: InstitucionExtendida[] = [];
    usuario!: UsuarioModel;
    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private usuarioService: UsuarioService,
        private rolService: RolService,
        private institucionService: InstitucionService,
        private messageService: MessageService
    ) {}
    ngOnInit(): void {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Gestión de Usuarios' }, { label: 'Usuarios' }, { label: 'Nuevo', route: '/usuarios/editar' }];

        this.initializeUserForm();

        // Cargar instituciones
        this.institucionService.getInstituciones().subscribe({
            next: (data) => {
                this.instituciones = data
                    .filter(institucion => institucion.estado === EstadoConfiguracionInstitucional.Activo)
                    .map(institucion => ({
                        ...institucion,
                        displayName: `${institucion.codigo} - ${institucion.nombre}`
                    }))
                    .sort((a, b) => a.nombre.localeCompare(b.nombre));
            },
            error: (error) => {
                console.error('Error fetching instituciones:', error);
            }
        });

        this.activatedRoute.params.subscribe((params) => {
            const id = params['id'];
            if (id) {
                this.usuarioService.getUsuario(id).subscribe({
                    next: (usuario) => {
                        this.rolService.getRoles().subscribe({
                            next: (data) => {
                                this.roles = data.filter(role => role.estado === 'Activo');
                                this.usuario = usuario;
                                this.id = usuario.id;
                                this.usuarioForm.patchValue(usuario);
                                this.usuarioForm.get('roles')!.setValue(usuario.roles[0]);
                                this.actualizarNombre();
                            },
                            error: (error) => {
                                console.error('Error fetching roles:', error);
                            }
                        });
                    },
                    error: (error) => {
                        console.error('Error fetching usuario:', error);
                    }
                });
            }
        });
        this.usuarioForm.get('primerNombre')!.valueChanges.subscribe(() => this.actualizarNombre());
        this.usuarioForm.get('segundoNombre')!.valueChanges.subscribe(() => this.actualizarNombre());
    }
    initializeUserForm() {
        this.usuarioForm = this.fb.group({
            id: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^auth0\\|[0-9a-fA-F]{24}$')]],
            correo: ['', [Validators.required, Validators.email]],
            nombre: [{ value: '', disabled: true }],
            telefono: ['', [Validators.pattern('^[0-9]+$')]],
            avatarUrl: ['', [Validators.pattern('https?://.+')]],
            userName: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
            tipoUsuario: ['Interno', [Validators.required]],
            idEntidadEstado: [''],
            roles: ['', [Validators.required]],
            estado: [''],
            eliminado: [false],
            primerNombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
            segundoNombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]]
        });

        // Agregar listener para el cambio de tipo de usuario
        this.usuarioForm.get('tipoUsuario')!.valueChanges.subscribe((tipoUsuario) => {
            const institucionControl = this.usuarioForm.get('idEntidadEstado');
            const rolesControl = this.usuarioForm.get('roles');

            if (tipoUsuario === 'Externo') {
                institucionControl!.setValidators([Validators.required]);
                // Establecer automáticamente el rol como "Externo" para usuarios externos
                rolesControl!.setValue('Externo');
                rolesControl!.disable();
            } else {
                institucionControl!.clearValidators();
                institucionControl!.setValue('');
                // Habilitar la selección de roles para usuarios internos
                rolesControl!.enable();
                if (rolesControl!.value === 'Externo') {
                    rolesControl!.setValue('');
                }
            }
            institucionControl!.updateValueAndValidity();
            rolesControl!.updateValueAndValidity();
        });
    }
    actualizarNombre() {
        const primerNombre = this.usuarioForm.get('primerNombre')!.value || '';
        const segundoNombre = this.usuarioForm.get('segundoNombre')!.value || '';
        const nombreCompleto = `${primerNombre} ${segundoNombre}`.trim();
        this.usuarioForm.get('nombre')!.setValue(nombreCompleto, { emitEvent: false });
    }

    onSubmit() {
        if (this.usuarioForm.invalid) {
            this.usuarioForm.markAllAsTouched();
            return;
        }
        this.grabando = true;

        // Obtener los valores del formulario incluyendo campos deshabilitados
        const formValue = this.usuarioForm.getRawValue();

        const rolesSeleccionados = formValue.roles;
        if (typeof rolesSeleccionados === 'string') {
            formValue.roles = [rolesSeleccionados];
        }

        this.usuario = {
            ...this.usuario,
            ...formValue
        };

        this.usuario.eliminado = false;

        this.usuarioService.putUsuario(this.usuario.id, this.usuario).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
            },
            error: (error) => {
                console.error('Error updating usuario:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el usuario' });
                this.grabando = false;
            },
            complete: () => {
                this.grabando = false;
            }
        });
    }
}
