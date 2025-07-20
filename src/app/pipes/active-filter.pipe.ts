import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'activeFilter',
    standalone: true
})
export class ActiveFilterPipe implements PipeTransform {
    transform(items: any[], sortForODS: boolean = false): any[] {
        if (!items) {
            return [];
        }

        // Filtrar elementos activos
        const activeItems = items.filter(item => item.estado === 0);

        // Si es para ODS, aplicar ordenamiento especial
        if (sortForODS) {
            return activeItems.sort((a, b) => {
                // Ordenar por id primero
                if (a.id !== b.id) {
                    return a.id - b.id;
                }
                // Si los id son iguales, ordenar por código
                return a.codigo.localeCompare(b.codigo);
            });
        }

        return activeItems;
    }
}
