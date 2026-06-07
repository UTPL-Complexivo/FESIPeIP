import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../service/usuario.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const AuthRoleGuard: CanActivateFn = (route, state) => {
    const userService = inject(UsuarioService);
    const router = inject(Router);
    const expectedRoles = (route.data['expectedRoles'] as Array<string> | undefined) ?? [];

    return userService.getMe().pipe(
        map((user) => {
            if (!user || !user.roles || user.roles.length === 0) {
                router.navigate(['/auth/access']);
                return false;
            }

            const userRoles = user.roles.map((role) => role.toLowerCase().trim());
            if (userRoles.includes('administrador')) {
                return true;
            }

            const normalizedExpectedRoles = expectedRoles.map((role) => role.toLowerCase().trim());
            const hasRole = normalizedExpectedRoles.some((role) => userRoles.includes(role));
            if (!hasRole) {
                router.navigate(['/auth/access']);
                return false;
            }
            return true;
        }),
        catchError(() => {
            router.navigate(['/auth/access']);
            return of(false);
        })
    );
};
