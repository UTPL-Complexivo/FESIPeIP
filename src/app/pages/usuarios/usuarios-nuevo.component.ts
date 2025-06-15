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
import { RolModel } from '../../models/rol.model';
import { RolService } from '../../service/rol.service';
import { ToastModule } from 'primeng/toast';
import { UsuarioService } from '../../service/usuario.service';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-usuarios-nuevo',
    standalone: true,
    template: `
        <div class="card">
            <div class="font-semibold text-xl">Nuevo Usuario</div>
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
                        <button pButton type="button" icon="pi pi-arrow-left" label="Regresar" class="p-button-secondary mr-2" [routerLink]="['/gestion-usuarios/usuarios']"></button>
                        <button pButton type="submit" icon="pi pi-save" label="Guardar" class="mr-2" [disabled]="grabando"></button>
                        <p-button type="button" icon="pi pi-refresh" label="Resetear" severity="warn" variant="outlined" (click)="initializeUserForm()" [disabled]="grabando"></p-button>
                    </ng-template>
                </p-toolbar>
                <div class="flex gap-2 mt-8 mb-6">
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
                            @if (usuarioForm.get('primerNombre')?.errors?.['maxlength']) {
                                <p-message severity="error" variant="simple" size="small">Primer Nombre no puede exceder los 255 caracteres</p-message>
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
                                @if (usuarioForm.get('segundoNombre')?.errors?.['maxlength']) {
                                    <p-message severity="error" variant="simple" size="small">Segundo Nombre no puede exceder los 255 caracteres</p-message>
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
                        @if (usuarioForm.get('userName')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small">Usuario no puede exceder los 100 caracteres</p-message>
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
                <div class="p-field mb-8">
                    <p-floatLabel>
                        <p-select id="roles" formControlName="roles" [options]="roles" optionLabel="nombre" optionValue="nombre" class="w-1/5" [showClear]="true"></p-select>
                        <label for="tipoUsuario">Rol</label>
                    </p-floatLabel>
                    @if (usuarioForm.get('roles')?.invalid && usuarioForm.get('roles')?.touched) {
                        @if (usuarioForm.get('roles')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small">Rol es requerido</p-message>
                        }
                        @if (usuarioForm.get('roles')?.errors?.['pattern']) {
                            <p-message severity="error" variant="simple" size="small">Rol debe contener solo letras, números y comas</p-message>
                        }
                    }
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
            </form>
        </div>
        <p-toast position="top-right"></p-toast>
    `,
    imports: [BreadcrumbModule, FloatLabelModule, RouterModule, CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, MessageModule, SelectModule, ToastModule, ToolbarModule],
    providers: [MessageService]
})
export class UsuariosNuevoComponent implements OnInit {
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;
    usuarioForm!: FormGroup;
    nombreCompleto = '';
    primerNombre = '';
    segundoNombre = '';
    grabando = false;
    tipoUsuarios = [
        { label: 'Interno', value: 'Interno' },
        { label: 'Externo', value: 'Externo' }
    ];
    roles: RolModel[] = [];
    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private rolService: RolService,
        private usuarioService: UsuarioService
    ) {}
    ngOnInit() {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Gestión de Usuarios' }, { label: 'Usuarios' }, { label: 'Nuevo', route: '/usuarios/nuevo' }];
        this.rolService.getRoles().subscribe({
            next: (data) => {
                this.roles = data.filter(role => role.estado === 'Activo');
            },
            error: (error) => {
                console.error('Error fetching roles:', error);
            }
        });

        this.initializeUserForm();
        this.usuarioForm.get('primerNombre')!.valueChanges.subscribe(() => this.actualizarNombre());
        this.usuarioForm.get('segundoNombre')!.valueChanges.subscribe(() => this.actualizarNombre());
    }

    initializeUserForm() {
        this.usuarioForm = this.fb.group({
            correo: ['', [Validators.required, Validators.email]],
            nombre: [{ value: this.nombreCompleto, disabled: true }],
            telefono: ['', [Validators.pattern('^[0-9]+$')]],
            avatarUrl: ['', [Validators.pattern('https?://.+')]],
            userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            tipoUsuario: ['Interno', [Validators.required]],
            roles: ['', [Validators.required]],
            estado: ['Activo'],
            eliminado: [false],
            primerNombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
            segundoNombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]]
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
            console.info('Usuario con errores:', this.usuarioForm);
            return;
        }
        this.grabando = true;

        const rolesSeleccionados = this.usuarioForm.get('roles')!.value;
        if (typeof rolesSeleccionados === 'string') {
            this.usuarioForm.get('roles')!.setValue([rolesSeleccionados]);
        }

        this.usuarioService.addUsuario(this.usuarioForm.value).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
                this.usuarioForm.reset();
                this.initializeUserForm();
            },
            error: (error) => {
                console.error('Error al crear el usuario:', error);
                this.grabando = false;
            },
            complete: () => {
                this.grabando = false;
            }
        });
    }
}
