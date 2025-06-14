import { Component, OnInit } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RolService } from '../../service/rol.service';
import { RolModel } from '../../models/rol.model';

@Component({
    selector: 'rol-editar',
    standalone: true,
    template: `<div class="card">
            <div class="font-semibold text-xl">Editar Rol {{ id }}</div>
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
            <form [formGroup]="rolForm" (ngSubmit)="onSubmit()" class="p-fluid mt-4">
                <p-toolbar>
                    <ng-template #start>
                        <button pButton type="button" icon="pi pi-arrow-left" label="Regresar" class="p-button-secondary mr-2" [routerLink]="['/roles']"></button>
                        <button pButton type="submit" icon="pi pi-save" label="Guardar" class="mr-2"></button>
                    </ng-template>
                </p-toolbar>
                <div class="p-field mb-6 mt-8">
                    <p-floatLabel>
                        <input id="id" type="text" pInputText formControlName="id" class="w-1/2" />
                        <label for="id">Id</label>
                    </p-floatLabel>
                </div>
                <div class="p-field mb-6 mt-8">
                    <p-floatLabel>
                        <input id="nombre" type="text" pInputText formControlName="nombre" class="w-1/2" />
                        <label for="nombre">Nombre</label>
                    </p-floatLabel>
                    @if (rolForm.get('nombre')?.invalid && rolForm.get('nombre')?.touched) {
                        @if (rolForm.get('nombre')?.errors?.['required']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre es requerido." />
                        }
                        @if (rolForm.get('nombre')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre debe tener al menos 3 caracteres." />
                        }
                        @if (rolForm.get('nombre')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="El nombre no puede exceder los 100 caracteres." />
                        }
                    }
                </div>
                <div class="p-field mb-6">
                    <p-floatLabel>
                        <input id="descripcion" type="text" pInputText formControlName="descripcion" class="w-full" />
                        <label for="descripcion">Descripción</label>
                    </p-floatLabel>
                    @if (rolForm.get('descripcion')?.invalid && rolForm.get('descripcion')?.touched) {
                        @if (rolForm.get('descripcion')?.errors?.['minlength']) {
                            <p-message severity="error" variant="simple" size="small" text="La descripción debe tener al menos 3 caracteres." />
                        }
                        @if (rolForm.get('descripcion')?.errors?.['maxlength']) {
                            <p-message severity="error" variant="simple" size="small" text="La descripción no puede exceder los 2000 caracteres." />
                        }
                    }
                </div>
            </form>
        </div>
        <p-toast position="top-right"></p-toast>`,
    imports: [BreadcrumbModule, RouterModule, CommonModule, ReactiveFormsModule, ToolbarModule, FloatLabelModule, MessageModule, ToastModule, InputTextModule, ButtonModule],
    providers: [MessageService]
})
export class RolEditarComponent implements OnInit {
    id: string = '';
    items: MenuItem[] | undefined;
    rolForm!: FormGroup;
    rol!: RolModel;
    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private rolService: RolService
    ) {}
    ngOnInit() {
        this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Gestión de Usuarios' }, { label: 'Roles' }, { label: 'Editar', route: ['/roles', this.id] }];
        this.activatedRoute.params.subscribe((params) => {
            this.id = params['id'];
            this.rolService.getRol(this.id).subscribe({
                next: (rol) => {
                    this.rol = rol;
                    this.rolForm.patchValue({
                        id: rol.id,
                        nombre: rol.nombre,
                        descripcion: rol.descripcion,
                        estado: rol.estado
                    });
                },
                error: (error) => {
                    console.error('Error al obtener el rol:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el rol.' });
                }
            });
        });
        this.initializeUserForm();
    }
    initializeUserForm() {
        this.rolForm = this.fb.group({
            id: [{ value: '', disabled: true }, Validators.required],
            nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            descripcion: ['', [Validators.minLength(3), Validators.maxLength(2000)]],
            estado: ['', Validators.required]
        });
    }
    onSubmit() {
        if (this.rolForm.invalid) {
            console.error('Formulario errado:', this.rolForm.value);
            this.rolForm.markAllAsTouched();
            return;
        }

        const updatedRol = {
            ...this.rolForm.value,
            id: this.rol.id
        };

        this.rolService.updateRol(this.id, updatedRol).subscribe({
            next: (response) => {
                const { error, mensaje } = response;
                if (error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    return;
                }
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
            },
            error: (error) => {
                console.error('Error al actualizar el rol:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el rol.' });
            }
        });
    }
}
