import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'activeApproveFilter',
    standalone: true
})
export class ActiveApproveFilterPipe implements PipeTransform {
    transform(items: any[], sortForODS: boolean = false): any[] {
        if (!items) {
            return [];
        }

        const activeItems = items.filter(item => item.estado === 2);

        if (sortForODS) {
            return activeItems.sort((a, b) => {
                if (a.id !== b.id) {
                    return a.id - b.id;
                }
                return a.codigo.localeCompare(b.codigo);
            });
        }

        return activeItems;
    }
}
